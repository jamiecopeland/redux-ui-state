import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { setUIState, replaceUIState, destroyUIState } from './actions';
import { DEFAULT_BRANCH_NAME } from './constants';

/**
 * The default shape of a store containing the uiState reducer
 */
export interface DefaultStateShape {
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
  setUIState: (state: TUIState) => void;
  replaceUIState: (state: TUIState) => void;
  resetUIState: () => void;
  destroyUIState: () => void;
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
  dispatch: Dispatch<DefaultStateShape>;
}

/**
 * All the props of the component returned by addReduxUIState
 */
export type ExportedComponentProps = ExportedComponentStateProps & ExportedComponentDispatchProps;

/**
 * Selects the ui state branch from the default location in the Redux store
 */
export const defaultBranchSelector = (state: DefaultStateShape): UIStateBranch => state[DEFAULT_BRANCH_NAME];

/**
 * The props passed into the idSelector
 */
export interface IdSelectorProps {
  id: string;
}

/**
 * Selects the id passed in by the props
 */
export const idSelector = (_: object, { id }: IdSelectorProps) => id;

/**
 * The shape of the props passed into branchSelectorSelector
 */
export interface BranchSelectorSelectorProps<TAppState> {
  branchSelector: (state: TAppState) => UIStateBranch;
}

/**
 * Selects the uiStateBranchSelector from the props
 */
export const branchSelectorSelector = <TAppState>(
  _: object, { branchSelector }: BranchSelectorSelectorProps<TAppState>
) =>
  branchSelector;

/**
 * Selects uiState of a component
 */
export const uiStateSelector = createSelector(
  state => state,
  idSelector,
  branchSelectorSelector,
  (state, id, branchSelector = defaultBranchSelector) => branchSelector(state).components[id],
);

/**
 * Maps uiStateBranch to props if the default state shape for the Redux store has been used
 */
export const defaultMapStateToProps = (state: DefaultStateShape): ExportedComponentStateProps => ({
  uiStateBranch: defaultBranchSelector(state),
});

/**
 * Maps dispatch to props.
 * NOTE: This will not vary based on state shape
 */
export const defaultMapDispatchToProps = (dispatch: Dispatch<Object>) => ({
  dispatch,
});

/**
 * A string or a function accepting the props as an argument and returning a string
 */
export type Id<TProps> = string | ((props: TProps) => string);

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
  if (idIsString(id)) {
    return id;
  }

  if (idIsFunction(id)) {
    return id(props);
  }

  return undefined;
}

// Initial State
export type InitialStateFunction<TUIState, TProps> = ((props: TProps, existingState?: TUIState) => TUIState);
export type InitialState<TUIState, TProps> = TUIState | InitialStateFunction<TUIState, TProps>;

export function initialStateIsString<TUIState, TProps>(
  initialState: InitialState<TUIState, TProps>
): initialState is TUIState {
  return typeof initialState === 'string';
}

export function initialStateIsFunction<TUIState, TProps>(
  initialState: InitialState<TUIState, TProps>
): initialState is (props: TProps) => TUIState {
  return typeof initialState === 'function';
}

export function getInitialStateValue<TUIState, TProps>(
  initialState: InitialState<TUIState, TProps>, props: TProps, existingState?: TUIState
): TUIState {
  if (typeof initialState === 'object') {
    return initialState as TUIState;
  }

  if (typeof initialState === 'function') {
    return (initialState as InitialStateFunction<TUIState, TProps>)(props, existingState);
  }

  return undefined;
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
  dispatch: Dispatch<DefaultStateShape>,
  props: TProps,
  id: string,
  initialState: InitialState<TUIState, TProps>
): DispatchProps<TUIState> {
  return {
    setUIState: (state: TUIState): Action => dispatch(setUIState<TUIState>({
      id,
      state: state,
    })),
    replaceUIState: (state: TUIState): Action => dispatch(replaceUIState<TUIState>({
      id,
      state: state,
    })),
    resetUIState: (): Action => dispatch(replaceUIState<TUIState>({
      id,
      state: getInitialStateValue(initialState, props),
    })),
    destroyUIState: (): Action => dispatch(destroyUIState({
      id,
    })),
  };
}

export const omitReduxUIProps = (props: ExportedComponentProps) => {
  let cleanedProps = {...props};
  delete cleanedProps.uiStateBranch;
  delete cleanedProps.dispatch;
  return cleanedProps;
};

/**
 * Creates a connect wrapper for the addReduxUIState higher order component. If custom mappers are not specified,
 * defaults will be used.
 */
export function createConnectWrapper<TProps, TAppState>(
  mapStateToProps: (state: TAppState | DefaultStateShape) => ExportedComponentStateProps = defaultMapStateToProps,
  mapDispatchToProps: (dispatch: Dispatch<TAppState>) => { dispatch: Dispatch<TAppState>; } = defaultMapDispatchToProps
) {
  return (component: React.ComponentClass<ExportedComponentProps & TProps> ) =>
  connect<
    ExportedComponentStateProps,
    ExportedComponentDispatchProps,
    TProps
  >(mapStateToProps, mapDispatchToProps)(component);
};
