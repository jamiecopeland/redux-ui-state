import * as React from 'react';
import { Dispatch, Action } from 'redux';

import { setUIState } from './actions';
import { DEFAULT_BRANCH_NAME } from './constants';
import { createSelector } from 'reselect';

//////////////////////////////////////////////////
// Id interfaces and functions

/**
 * A string or a function accepting the props as an argument and returning a string
 */
export type IdFunction<TProps> = (props: TProps) => string;
export type Id<TProps> = string | IdFunction<TProps>;

/**
 * A type guard guaranteeing id is a string;
 */
export const idIsString = <TProps>(id: Id<TProps>): id is string => typeof id === 'string';

/**
 * A type guard guaranteeing id is a function that accepts props and returns a string
 */
export const idIsFunction = <TProps>(id: Id<TProps>): id is IdFunction<TProps> => typeof id === 'function';

/**
 * Returns a string or undefined from the union type of (string | function that returns string)
 */
export const getStringFromId = <TProps>(id: Id<TProps>, props: TProps): string | undefined => {
  if (idIsString(id)) { return id; }
  if (idIsFunction(id)) { return id(props); }
  return undefined;
};

//////////////////////////////////////////////////
// Interfaces

/**
 * The default shape of a store containing the uiState reducer
 */
export interface DefaultStoreState {
  // This is slightly gross and involves repetition of the value in DEFAULT_BRANCH_NAME, but
  // TypeScript doesn't allow computed property names: [DEFAULT_BRANCH_NAME]: UIStateBranch;
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
 * A Selector that accepts the full application state and returns the Redux UI State branch
 */
export type UIStateBranchSelector<TAppState = DefaultStoreState> = (appState: TAppState) => UIStateBranch;

/**
 * The props representing the key of the UI state data in the store
 */
export interface UIStateIdProps<TProps> {
  uiStateId: Id<TProps>;
}

/**
 * The function used to make changes to the state
 */
export type SetUIStateFunction<TUIState> = (state: Partial<TUIState>) => void;

export type TransformPropsFunction<TUIState, TProps, TTransformedProps> = (
  stateProps: StateProps<TUIState>,
  dispatchProps: DispatchProps<TUIState>,
  ownProps: Readonly<TProps>,
) => TTransformedProps;

//////////////////////////////////////////////////
// Selectors

/**
 * Selects the ui state branch from the default location in the Redux store
 */
export const defaultUIStateBranchSelector = <TAppState = DefaultStoreState>(state: TAppState): UIStateBranch => (
  state[DEFAULT_BRANCH_NAME]
);

/**
 * The props containing the selector for the uiState branch.
 */
export interface SelectorProps<TAppState = DefaultStoreState> {
  uiStateBranchSelector?: UIStateBranchSelector<TAppState>;
}

export const uiStateBranchSelector = <TAppState = DefaultStoreState>(
  state: TAppState,
  props: SelectorProps<TAppState>
) => (props.uiStateBranchSelector || defaultUIStateBranchSelector)(state);

export const uiStateComponentsSelector = createSelector(
  uiStateBranchSelector,
  (uiStateBranch) => uiStateBranch.components
);

export const idSelector = <TProps>(_: any, props: TProps & UIStateIdProps<TProps>) => { // tslint:disable-line:no-any
  if (!props.uiStateId) {
    throw new Error(`
      Couldn\'t find uiStateId prop for idSelector in Redux UI State.
      // TODO add extra documentation explaining likely reason for error occurring
    `);
  }
  return getStringFromId(props.uiStateId, props);
};

export const propsSelector = <TProps>(_: any, props: TProps) => props; // tslint:disable-line:no-any

export const uiStateSelector = createSelector(
  uiStateComponentsSelector,
  idSelector,
  propsSelector,
  (components, id, props) => {
    const uiState = components[id];
    if (!uiState) {
      console.warn(
        `redux-ui-state uiStateSelector found undefined state for key: ${id}.\n` +
        `This is most often due to the value not being initialized in createReducer.`
      );
    }
    return uiState;
  }
);

export const setUIStateSelector = <TUIState, TProps>(
  dispatch: Dispatch<any>, // tslint:disable-line:no-any
  props?: TProps
): SetUIStateFunction<TUIState>  => createSelector(
  idSelector,
  id => (state: Partial<TUIState>): Action => dispatch(setUIState<Partial<TUIState>>({
    id,
    state,
  }))
)(dispatch, props);
