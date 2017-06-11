import * as React from 'react';
import { Dispatch, Action } from 'redux';


import { setUIState, replaceUIState } from './actions';
import { DEFAULT_BRANCH_NAME } from './constants';
import { createSelector } from 'reselect';

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
  replaceUIState?: (state: TUIState) => void;
}

/**
 * All the props props passed into a component wrapped by addReduxUIState
 */
export type Props<TUIState> = StateProps<TUIState> & DispatchProps<TUIState>;

/**
 * The component passed into addReduxUIState
 */
export type AbstractWrappedComponent<TProps> = React.StatelessComponent<TProps> | React.ComponentClass<TProps>;

/**
 * A component being passed into addReduxUIState that accepts the default props
 */
export type WrappedComponentWithoutTransform<TUIState, TProps> = AbstractWrappedComponent<TProps & Props<TUIState>>;

/**
 * A component being passed into addReduxUIState that accepts transformed props
 */
export type WrappedComponentWithTransform<TUIState, TProps, TTransformedProps> = AbstractWrappedComponent<TProps & TTransformedProps>; // tslint:disable-line:max-line-length

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

export type UIStateBranchSelector<TAppState = DefaultStoreState> = (appState: TAppState) => UIStateBranch;

/**
 * Selects the ui state branch from the default location in the Redux store
 */
export const defaultBranchSelector = <TAppState = DefaultStoreState>(state: TAppState): UIStateBranch => state[DEFAULT_BRANCH_NAME];




export interface TempSelectorProps<TAppState = DefaultStoreState> {
  uiStateBranchSelector?: UIStateBranchSelector<TAppState>;
}

export const uiStateBranchSelector = <TAppState = DefaultStoreState>(
  state: TAppState,
  props: TempSelectorProps<TAppState>
) => (props.uiStateBranchSelector || defaultBranchSelector)(state);

export const uiStateComponentsSelector = createSelector(
  uiStateBranchSelector,
  (uiStateBranch) => uiStateBranch.components
);

export interface ReduxUIStateIdProps<TProps> {
  uiStateId: Id<TProps>;
}

export const idSelector = <TProps>(_: any, props: TProps & ReduxUIStateIdProps<TProps>) => {
  if (!props.uiStateId) {
    throw(`
      Couldn\'t find uiStateId prop for idSelector in Redux UI State${props.uiStateId}
      // TODO add extra documentation explaining likely reason for error occurring
    `);
  }
  return getStringFromId(props.uiStateId, props)
};

export const propsSelector = <TProps>(_: any, props: TProps) => props;

export const uiStateSelector = createSelector(
  uiStateComponentsSelector,
  idSelector,
  propsSelector,
  (components, id, props) => components[id]
);

type SetUIState<TUIState> = (state: Partial<TUIState>) => void;
export const setUIStateSelector = <TUIState, TProps>(dispatch: Dispatch<any>, props?: TProps): SetUIState<TUIState>  => createSelector(
  idSelector,
  (idString) => (state: Partial<TUIState>): Action => dispatch(setUIState<Partial<TUIState>>({
    id: idString,
    state,
  }))
)(dispatch, props);





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
 * A string or a function accepting the props as an argument and returning a string
 */
export type Id<TProps> = string | ((props: TProps) => string);

// TODO Add comment
export type TransformPropsFunction<TUIState, TProps, TTransformedProps> = (
  stateProps: StateProps<TUIState>,
  dispatchProps: DispatchProps<TUIState>,
  ownProps: Readonly<TProps>,
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

export interface IdProps<TProps> {
  id: Id<TProps>;
}

export const getItemFromUIStateBranch = <TProps>(uiStateBranch: UIStateBranch, id: Id<TProps>, props: TProps) => (
  // TODO Look into a nicer way of handling this
  uiStateBranch.components[getStringFromId(id, props)] ||
  console.warn(`${getStringFromId(id, props)} is undefined Redux UI state`)
);

export const createUIStateSelector = <TAppState = DefaultStoreState>(
  uiStateBranchSelector: UIStateBranchSelector<TAppState> = defaultBranchSelector as any // tslint:disable-line:no-any
) => <TUIState, TProps>(
  id: Id<TProps>,
) => (
  state: TAppState,
  props: TProps
): TUIState => getItemFromUIStateBranch(uiStateBranchSelector(state), id, props);

export const createStateProps = <TAppState = DefaultStoreState>(
  uiStateBranchSelector: UIStateBranchSelector<TAppState> = defaultBranchSelector as any // tslint:disable-line:no-any
) => <TProps>(
  id: Id<TProps>,
  state: TAppState,
  props: TProps,
) => ({
  uiState: getItemFromUIStateBranch(uiStateBranchSelector(state), id, props)
});

/**
 * Creates the dispatch props for the wrapped component
 */
export const createDispatchProps = <TUIState, TProps>(
  id: Id<TProps>,
  dispatch: Dispatch<DefaultStoreState>,
  props: TProps,
): DispatchProps<TUIState> => {
  const stringId = getStringFromId(id, props);
  return {
    setUIState: (state: Partial<TUIState>): Action => dispatch(setUIState<Partial<TUIState>>({
      id: stringId,
      state,
    })),
    replaceUIState: (state: TUIState): Action => dispatch(replaceUIState<TUIState>({
      id: stringId,
      state: state,
    })),
  };
};

export const omitReduxUIProps = <TProps extends object>(props: ExportedComponentProps & TProps) => {
  // TODO Remove nasty any once type checking regression is fixed in TypeScript 2.4
  const { uiStateBranch, ...rest } = props as any; // tslint:disable-line:no-any
  return rest;
};
