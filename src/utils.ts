
import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { createSelector, ParametricSelector } from 'reselect';

import { setUIState } from './actions';
import { DEFAULT_BRANCH_NAME } from './constants';

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
  // TypeScript doesn't currently allow computed property names in interfaces - [DEFAULT_BRANCH_NAME]: UIStateBranch;
  uiState: UIStateBranch;
}

export type ComponentsDictionary = Record<string, {}>;

/**
 * The branch of the Redux store governed by reduxUIState's reducer
 */
export interface UIStateBranch {
  components: ComponentsDictionary;
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
// export type UIStateBranchSelector<TAppState = DefaultStoreState> = (appState: TAppState) => UIStateBranch;
// This looks weird, but the standard type definition (commented out above) causes a Reselect import error
export interface UIStateBranchSelector<TAppState> extends ParametricSelector<TAppState, {}, UIStateBranch> {
  (appState: TAppState): UIStateBranch;
}

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

export const stateSelector = <TAppState = DefaultStoreState>(state: TAppState) => state;
export const propsSelector = <TProps>(_: any, props: TProps) => props; // tslint:disable-line:no-any

/**
 * Selects the ui state branch from the default location in the Redux store
 */
export const defaultUIStateBranchSelector = (state: DefaultStoreState): UIStateBranch => state[DEFAULT_BRANCH_NAME];

/**
 * The props containing the selector for the uiState branch.
 */
export interface UIStateBranchSelectorSelectorProps<TAppState> {
  uiStateBranchSelector?: UIStateBranchSelector<TAppState>;
}

/**
 * Selects the uiState branch selector, returning defaultUIStateBranchSelector if a custom is not found in the props
 */
export const uiStateBranchSelectorSelector = <TAppState>(
  _: any, // tslint:disable-line:no-any
  props: UIStateBranchSelectorSelectorProps<TAppState>
) => {
  const uiStateBranchSelector = props && props.uiStateBranchSelector;

  if (!uiStateBranchSelector) {
    throw new Error(
      'redux-ui-state Couldn\'t find uiStateBranchSelector in props - this is most likely because ' +
      'createConnectReduxUIState was called without an argument');
  }

  return uiStateBranchSelector;
};

export const uiStateBranchSelector = createSelector(
  uiStateBranchSelectorSelector,
  stateSelector,
  (selector, state) => {
    const branch = selector(state);
    if (!branch) {
      throw new Error(
        'redux-ui-state Could not select UI state branch from the store - this is either because the reducer has not' +
        'been composed properly or the selector is looking in the wrong location.'
      );
    }
    return branch;
  }
);

export const uiStateComponentsSelector = createSelector(
  uiStateBranchSelector,
  (uiStateBranch) => uiStateBranch.components
);

export const idSelector = <TProps>(_: any, props: TProps & UIStateIdProps<TProps>) => { // tslint:disable-line:no-any
  if (!props.uiStateId) {
    throw new Error(
      'Couldn\'t find uiStateId prop for idSelector in Redux UI State - this usually occurs because the id passed ' +
      'into connectReduxUIState is undefined, or the uiStateId prop being passed into a component is undefined.'
    );
  }
  return getStringFromId(props.uiStateId, props);
};

export const uiStateSelector = createSelector(
  uiStateComponentsSelector,
  idSelector,
  (components, id) => {
    const uiState = id && components[id];
    if (!uiState) {
      console.warn(
        `redux-ui-state uiStateSelector found undefined state for key: ${id}.\n` +
        `This is most often due to the value not being initialized in createReducer.`
      );
    }
    return uiState;
  }
);

/**
 * Selects the setUIState function.
 * This differs from normal selectors in that it is a dispatch selector, meaning that it expects dispatch as the first
 * function and returns a function capable of dispatching through the Redux store.
 * @param dispatch The dispatch function of the Redux store
 * @param props The component's props
 */
export const setUIStateSelector = <TUIState, TProps extends UIStateIdProps<TProps>>(
  dispatch: Dispatch<any>, // tslint:disable-line:no-any
  props: TProps
) => {
  const id = idSelector<TProps>(undefined, props);
  if (!id) {
    throw new Error('redux-ui-state uiStateId is undefined');
  }
  return (state: Partial<TUIState>): Action => dispatch(setUIState<Partial<TUIState>>({ id, state }));
};
