import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
// import { createSelector } from 'reselect';

// TODO Investigate typings weirdness
// Importing the whole of reselect fixes a strange issue where the transpiler seems to swap out createSelector for
// Reselect.OutputParametricSelector but doesn't import the Reselect namespage in the uiStateSelector definition
import 'reselect';

import { setUIState, replaceUIState } from './actions';
import { DEFAULT_BRANCH_NAME } from './constants';

////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Utils
/**
 * The default shape of a store containing the uiState reducer
 */
export interface DefaultStoreState {
  // This is slightly gross and involves repetition of the value in DEFAULT_BRANCH_NAME, but
  // TypeScript doesn't allow: [DEFAULT_BRANCH_NAME]: ReduxUIBranchState;
  uiState: UIStateBranch;
}

/**
 * The branch of the Redux store governed by reduxUIState's reducer
 */
export interface UIStateBranch {
  components: Record<string, any>; // tslint:disable-line:no-any
}

/**
 * The state props passed into a component wrapped by addReduxUIState
 */
export interface StateProps<TUIState> {
  uiState: TUIState;
}

/**
 * The dispatch props passed into a component wrapped by addReduxUIState
 */
export interface DispatchProps<TUIState> {
  setUIState: (state: Partial<TUIState>) => void;
  replaceUIState: (state: TUIState) => void;
}

/**
 * All the props props passed into a component wrapped by addReduxUIState
 */
export type Props<TUIState> = StateProps<TUIState> & DispatchProps<TUIState>;

export type RawInputComponent<Props> = React.StatelessComponent<Props> | React.ComponentClass<Props>;

/**
 * A component being passed into addReduxUIState that accepts the default props
 */
export type InputComponent<TUIState, TProps> = RawInputComponent<TProps & Props<TUIState>>;

/**
 * A component being passed into addReduxUIState that accepts transformed props
 */
export type InputComponentWithTransform<TUIState, TProps, TTransformedProps> = RawInputComponent<TProps & TTransformedProps>; // tslint:disable-line:max-line-length

/**
 * The state props of the component returned by addReduxUIState
 */
export interface ExportedComponentStateProps {
  uiStateBranch: UIStateBranch;
}

/**
 * The dispatch props of the component returned by addReduxUIState
 */
export interface ExportedComponentDispatchProps {
  dispatch: Dispatch<DefaultStoreState>;
}

/**
 * All the props of the component returned by addReduxUIState
 */
export type ExportedComponentProps = ExportedComponentStateProps & ExportedComponentDispatchProps;

/**
 * Selects the ui state branch from the default location in the Redux store
 */
export const defaultBranchSelector = (state: DefaultStoreState): UIStateBranch => state[DEFAULT_BRANCH_NAME];

/**
 * Maps uiStateBranch to props if the default state shape for the Redux store has been used
 */
export const defaultMapStateToProps = (state: DefaultStoreState): ExportedComponentStateProps => ({
  uiStateBranch: defaultBranchSelector(state),
});

/**
 * Maps dispatch to props.
 * NOTE: This will not vary based on state shape
 */
export const defaultMapDispatchToProps = <TAppState = object>(dispatch: Dispatch<TAppState>) => ({
  dispatch,
});

/**
 * Creates a connect wrapper for the addReduxUIState higher order component. If custom mappers are not specified,
 * defaults will be used.
 */
export function createConnectWrapper<TProps = {}, TAppState = DefaultStoreState>(
  mapStateToProps: (state: TAppState | DefaultStoreState) => ExportedComponentStateProps = defaultMapStateToProps,
  mapDispatchToProps: (dispatch: Dispatch<TAppState>) => { dispatch: Dispatch<TAppState>; } = defaultMapDispatchToProps
) {
  return (component: React.ComponentClass<ExportedComponentProps & TProps> ) =>
  connect<
    ExportedComponentStateProps,
    ExportedComponentDispatchProps,
    TProps
  >(mapStateToProps, mapDispatchToProps)(component);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// addReduxUIState function Utils

/**
 * A string or a function accepting the props as an argument and returning a string
 */
export type Id<TProps> = string | ((props: TProps) => string);

// TODO Add comment
export type TransformPropsFunction<TUIState, TProps, TTransformedProps> = (
  uiState: TUIState,
  dispatchProps: DispatchProps<TUIState>,
  ownProps: Readonly<TProps>
) => TTransformedProps;

/**
 * A type guard guaranteeing id is a string;
 */
export function idIsString<TProps>(id: Id<TProps>): id is string {
  return typeof id === 'string';
}

/**
 * A type guard guaranteeing id is a function that accepts props and returns a string
 */
export function idIsFunction<TProps>(id: Id<TProps>): id is (props: TProps) => string {
  return typeof id === 'function';
}

/**
 * Returns a string or undefined from the union type of (string | function that returns string)
 */
export function getStringFromId<TProps>(id: Id<TProps>, props: TProps): string | undefined {
  return idIsFunction(id)
    ? id(props)
    : id;
}

/**
 * Extracts the state for a particutlar component from the UIStateBranch of the state tree
 */
export function getComponentStateFromUIStateBranch<TUIState>(state: UIStateBranch, id: string): TUIState {
  return state.components[id];
}

/**
 * Creates the dispatch props for the wrapped component
 */
export function mapDispatchToProps<TUIState, TProps>(
  dispatch: Dispatch<DefaultStoreState>,
  props: TProps,
  id: string,
): DispatchProps<TUIState> {
  return {
    setUIState: (state: Partial<TUIState>): Action => dispatch(setUIState<Partial<TUIState>>({
      id,
      state: state,
    })),
    replaceUIState: (state: TUIState): Action => dispatch(replaceUIState<TUIState>({
      id,
      state: state,
    })),
  };
}

export const omitReduxUIProps = <TProps extends object>(props: ExportedComponentProps & TProps) => {
  // TODO Remove nasty any once type checking regression is fixed in TypeScript 2.4
  const { uiStateBranch, ...rest } = props as any; // tslint:disable-line:no-any
  return rest;
};
