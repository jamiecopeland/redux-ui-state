import { ComponentClass } from 'react';
import { connect } from 'react-redux';
import {
  WrappedComponentWithDefaultProps,
  WrappedComponentWithMappedProps,
  DefaultStoreState,
  Id,
  uiStateSelector,
  setUIStateSelector,
  defaultUIStateBranchSelector,
  UIStateBranchSelector,
} from './utils';
import { StateProps, DispatchProps } from '../dist';

export interface __IMPORT_FIX {
  UIStateBranchSelector: UIStateBranchSelector<{}>;
}

export type MapConnectUIStateProps<TUIState, TTransformedProps, TProps> = (
  props: StateProps<TUIState> & DispatchProps<TUIState>,
  ownProps: Readonly<TProps>,
) => TTransformedProps;

/**
 * A higher order component responsible for injecting Redux UI State props (uiState and setUIState) into a Component
 * @param id A string or function that accepts component props and returns a string
 * @param mapProps A function that maps raw props into a nicer more contextually relevant shape
 */
export interface ConnectUIState {
  // tslint:disable-line:class-name
  <TUIState, TProps, TAppState = DefaultStoreState>(id: Id<TProps>): (
    Component: WrappedComponentWithDefaultProps<TUIState, TProps>
  ) => ComponentClass<TProps>;

  <TUIState, TProps, TMappedProps>(
    id: Id<TProps>,
    mapProps: MapConnectUIStateProps<
      TUIState,
      TMappedProps,
      TProps
    >
  ): (
    Component: WrappedComponentWithMappedProps<
      TUIState,
      TProps,
      TMappedProps
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
  TMappedProps,
  TAppState
>(
  id: Id<TProps>,
  mapProps?: MapConnectUIStateProps<
    TUIState,
    TMappedProps,
    TProps
  >
) => (
  Component:
    | WrappedComponentWithDefaultProps<TUIState, TProps>
    | WrappedComponentWithMappedProps<TUIState, TProps, TMappedProps> // tslint:disable-line:max-line-length
): ComponentClass<TProps> =>
  connect(
    (state: TAppState, props: TProps) => ({
      uiState: uiStateSelector(
        state,
        Object.assign({ uiStateId: id, uiStateBranchSelector }, props)
      ) as TUIState
    }),
    (dispatch, props: TProps) => ({
      setUIState: setUIStateSelector(
        dispatch,
        Object.assign({ uiStateId: id }, props)
      ),
    }),
    (stateProps, dispatchProps, ownProps) => mapProps
      ? mapProps(Object.assign({}, stateProps, dispatchProps), ownProps)
      : Object.assign({}, stateProps, dispatchProps, ownProps)
    
  )(
    // This any is in place because the function is overloaded - function interface variants will
    // catch errors relating to passing mismatching components and mapping functions
    // tslint:disable-next-line:no-any
    Component as any 
  );

export const defaultConnectUIState = setupConnectUIState(
  defaultUIStateBranchSelector
);


