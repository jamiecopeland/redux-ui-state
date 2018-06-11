import { ComponentClass } from 'react';
import { connect } from 'react-redux';
import {
  TransformPropsFunction,
  WrappedComponentWithoutTransform,
  WrappedComponentWithTransform,
  DefaultStoreState,
  Id,
  uiStateSelector,
  setUIStateSelector,
  defaultUIStateBranchSelector,
  UIStateBranchSelector,
} from './utils';

export interface __IMPORT_FIX {
  UIStateBranchSelector: UIStateBranchSelector<{}>;
}

/**
 * A higher order component responsible for injecting Redux UI State props (uiState and setUIState) into a Component
 * @param id A string or function that accepts component props and returns a string
 * @param transformPropsFunction A function that transforms raw props into a nicer more contextually relevant shape
 */
export interface ConnectUIState {
  // tslint:disable-line:class-name
  <TUIState, TProps, TAppState = DefaultStoreState>(id: Id<TProps>): (
    Component: WrappedComponentWithoutTransform<TUIState, TProps>
  ) => ComponentClass<TProps>;

  <TUIState, TProps, TTransformedProps>(
    id: Id<TProps>,
    transformPropsFunction: TransformPropsFunction<
      TUIState,
      TProps,
      TTransformedProps
    >
  ): (
    Component: WrappedComponentWithTransform<
      TUIState,
      TProps,
      TTransformedProps
    >
  ) => ComponentClass<TProps>;
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
export const setupConnectUIState = <TAppState = DefaultStoreState>(
  uiStateBranchSelector = defaultUIStateBranchSelector
): ConnectUIState => <
  TUIState,
  TProps extends {},
  TTransformedProps,
  TAppState
>(
  id: Id<TProps>,
  transformPropsFunction?: TransformPropsFunction<
    TUIState,
    TProps,
    TTransformedProps
  >
) => (
  Component:
    | WrappedComponentWithoutTransform<TUIState, TProps>
    | WrappedComponentWithTransform<TUIState, TProps, TTransformedProps> // tslint:disable-line:max-line-length
): ComponentClass<TProps> =>
  connect(
    (state: TAppState, props: TProps) => ({
      // TODO Remove nasty any once TypeScript allows interfaces to be spread - the compiler doesn't realise props is an
      // object even though this is specifed in the TProp generic definition
      // https://github.com/Microsoft/TypeScript/pull/13288
      // tslint:disable-next-line:no-any
      uiState: uiStateSelector(state, {
        uiStateId: id,
        uiStateBranchSelector,
        ...(props as any),
      }),
    }),
    (dispatch, props: TProps) => ({
      // See comment above about spreading interfaces
      // tslint:disable-next-line:no-any
      setUIState: setUIStateSelector(dispatch, {
        uiStateId: id,
        ...(props as any),
      }),
    }),
    // TODO Fix type issue related to possibly undefined uiState property in output of mapStateToProps
    // tslint:disable-next-line:no-any
    transformPropsFunction as any
  )(
    // This any is in place because the function is overloaded - function interface variants will catch errors relating to
    // passing mismatching components and transform functions
    Component as any // tslint:disable-line:no-any
  );

export const defaultConnectUIState = setupConnectUIState(
  defaultUIStateBranchSelector
);
