import { ComponentClass } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  WrappedComponentWithTransform,
  WrappedComponentWithoutTransform,
  DefaultStoreState,
  Id,
  TransformPropsFunction,
  UIStateBranchSelector,
  uiStateSelector,
  setUIStateSelector
} from './utils';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE TypeScript currently has an issue regarding function overloading and 3+ deep higher order functions.
// TODO Submit an issue with a minimal example and once fixed replace the private _connectReduxUIState function with
// createConnectReduxUIState, and the standard connectReduxUIState should be made by executing createConnectReduxUIState
// and passing in the default uiStateBranchSelector.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface _connectReduxUIState { // tslint:disable-line:class-name
  <TUIState, TProps, TAppState = DefaultStoreState>(
    id: Id<TProps>,
    uiStateBranchSelector?: UIStateBranchSelector<TAppState>
  ): (Component: WrappedComponentWithoutTransform<TUIState, TProps>) => React.ComponentClass<TProps>;

  <TUIState, TProps, TTransformedProps, TAppState = DefaultStoreState>(
    id: Id<TProps>,
    transformPropsFunction: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
    uiStateBranchSelector?: UIStateBranchSelector<TAppState>
  ): (Component: WrappedComponentWithTransform<TUIState, TProps, TTransformedProps>) => React.ComponentClass<TProps>;
}

const _connectReduxUIState: _connectReduxUIState = <TUIState, TProps extends object, TTransformedProps, TAppState = DefaultStoreState>( // tslint:disable-line:max-line-length
  id: Id<TProps>,
  transformPropsFunction?: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
  uiStateBranchSelector?: UIStateBranchSelector<TAppState>
) => (
  Component: WrappedComponentWithoutTransform<TUIState, TProps> | WrappedComponentWithTransform<TUIState, TProps, TTransformedProps> // tslint:disable-line:max-line-length
): ComponentClass<TProps> => connect( // TODO Add generics to connect?
    (state: TAppState, props: TProps) => ({
      // TODO Remove nasty any once type checking regression is fixed in TypeScript 2.4
      // tslint:disable-next-line:no-any
      uiState: uiStateSelector(state, { uiStateId: id, uiStateBranchSelector,  ...props as any })
    }),
    (dispatch: Dispatch<TAppState>, props: TProps) => ({
      // TODO Remove nasty any once type checking regression is fixed in TypeScript 2.4
      // tslint:disable-next-line:no-any
      setUIState: setUIStateSelector(dispatch, { uiStateId: id, ...props as any })
    }),
    transformPropsFunction
  )(
    // This any is ok, because the function overloading will catch errors relating to passing mismatching components
    // and transform functions
    Component as any // tslint:disable-line:no-any
  );

export interface connectReduxUIState { // tslint:disable-line:class-name
  <TUIState, TProps, TAppState = DefaultStoreState>(
    id: Id<TProps>,
  ): (Component: WrappedComponentWithoutTransform<TUIState, TProps>) => React.ComponentClass<TProps>;

  <TUIState, TProps, TTransformedProps>(
    id: Id<TProps>,
    transformPropsFunction: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
  ): (Component: WrappedComponentWithTransform<TUIState, TProps, TTransformedProps>) => React.ComponentClass<TProps>;
}

/**
 * A higher order component responsible for injecting Redux UI State props (uiState and setUIState) into a Component
 * @param id A string or function that accepts component props and returns a string
 * @param transformPropsFunction A function that transforms raw props into a nicer more contextually relevant shape
 */
export const connectReduxUIState: connectReduxUIState = <TUIState, TProps extends object, TTransformedProps>(
  id: Id<TProps>,
  transformPropsFunction?: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
) => _connectReduxUIState(id, transformPropsFunction);

/**
 * Creates a function with a identical functionality to connectReduxUIState, but using a custom UI state branch
 * selector.
 * This function is only necessary if the Redux UI State reducer is not located at the root of your store:
 * `state.uiState` (the default location) within the store.
 * @param uiStateBranchSelector The function that selects the uiState branch from the store
 */
export const createConnectReduxUIState = <TAppState>(uiStateBranchSelector: UIStateBranchSelector<TAppState>) => (
  <TUIState, TProps, TTransformedProps>(
    id: Id<TProps>,
    transformPropsFunction?: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
  ) => _connectReduxUIState(id, transformPropsFunction, uiStateBranchSelector)
) as connectReduxUIState;
