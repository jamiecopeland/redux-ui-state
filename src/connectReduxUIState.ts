import { ComponentClass } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  TransformPropsFunction,
  WrappedComponentWithoutTransform,
  WrappedComponentWithTransform,
  UIStateBranchSelector,
  DefaultStoreState,
  Id,
  uiStateSelector,
  setUIStateSelector,
  defaultUIStateBranchSelector,
} from './utils';

/**
 * A higher order component responsible for injecting Redux UI State props (uiState and setUIState) into a Component
 * @param id A string or function that accepts component props and returns a string
 * @param transformPropsFunction A function that transforms raw props into a nicer more contextually relevant shape
 */
export interface ConnectReduxUIState { // tslint:disable-line:class-name
  <TUIState, TProps, TAppState = DefaultStoreState>(
    id: Id<TProps>,
  ): (Component: WrappedComponentWithoutTransform<TUIState, TProps>) => React.ComponentClass<TProps>;

  <TUIState, TProps, TTransformedProps>(
    id: Id<TProps>,
    transformPropsFunction: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
  ): (Component: WrappedComponentWithTransform<TUIState, TProps, TTransformedProps>) => React.ComponentClass<TProps>;
}

/**
 * A higher order component factory that passes UI state related properties and functions to the wrapped component.
 * The first function should always be called only once during the life of an application as shown below, with the
 * result being a standard HOC.
 *
 * // utils.ts
 * const connectUIState = createConnectUIState(state => state.ui);
 *
 * // Counter.ts
 * ...
 * export default connectUIState('counter')(Counter);
 *
 * @param uiStateBranchSelector The function that selects the uiState branch from the store
 */
export const createConnectUIState = <TAppState = DefaultStoreState>(
  uiStateBranchSelector: UIStateBranchSelector<TAppState>
): ConnectReduxUIState => <TUIState, TProps extends object, TTransformedProps, TAppState>( // tslint:disable-line:max-line-length
  id: Id<TProps>,
  transformPropsFunction?: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
) => (
  Component: WrappedComponentWithoutTransform<TUIState, TProps> | WrappedComponentWithTransform<TUIState, TProps, TTransformedProps> // tslint:disable-line:max-line-length
): ComponentClass<TProps> => {
  return connect( // TODO Add generics to connect?
    (state: TAppState, props: TProps) => ({
      // TODO Remove nasty any once type checking regression is fixed in TypeScript 2.4 - the compiler doesn't realise
      // props is an object even though this is specifed in the TProp generic definition
      // tslint:disable-next-line:no-any
      uiState: uiStateSelector(state, { uiStateId: id, uiStateBranchSelector,  ...props as any })
    }),
    (dispatch: Dispatch<TAppState>, props: TProps) => ({
      // TODO Remove nasty any once type checking regression is fixed in TypeScript 2.4
      // tslint:disable-next-line:no-any
      setUIState: setUIStateSelector(dispatch, { uiStateId: id, ...props as any })
    }),
    transformPropsFunction!
  )(
    // This any is ok, because the function overloading will catch errors relating to passing mismatching components
    // and transform functions
    Component as any // tslint:disable-line:no-any
  );
};

export const defaultConnectUIState = createConnectUIState(defaultUIStateBranchSelector);
