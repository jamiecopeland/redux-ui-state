import { ComponentClass } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
// Fix this
import { uiStateSelector, setUIStateSelector } from './utils';

import {
  WrappedComponentWithTransform, WrappedComponentWithoutTransform,
  DefaultStoreState,
  Id, TransformPropsFunction,
  // UIStateBranchSelector,
  // createStateProps,
  // createDispatchProps
} from './utils';

export function connectReduxUIState<TUIState, TProps, TAppState = DefaultStoreState>(
  id: Id<TProps>,
  // uiStateBranchSelector?: UIStateBranchSelector<TAppState>
): (Component: WrappedComponentWithoutTransform<TUIState, TProps>) => React.ComponentClass<TProps>;

export function connectReduxUIState<TUIState, TProps, TTransformedProps, TAppState = DefaultStoreState>(
  id: Id<TProps>,
  transformPropsFunction: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
  // uiStateBranchSelector?: UIStateBranchSelector<TAppState>
): (Component: WrappedComponentWithTransform<TUIState, TProps, TTransformedProps>) => React.ComponentClass<TProps>;

export function connectReduxUIState<TUIState, TProps, TTransformedProps, TAppState = DefaultStoreState>(
  id: Id<TProps>,
  transformPropsFunction?: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
  // uiStateBranchSelector?: UIStateBranchSelector<TAppState>
) {
    return (
      Component:
        WrappedComponentWithoutTransform<TUIState, TProps>
        | WrappedComponentWithTransform<TUIState, TProps, TTransformedProps>
    ): ComponentClass<TProps> => connect( // TODO Add generics to connect?
        (state: TAppState, props: TProps) => ({
          uiState: uiStateSelector(state, {uiStateId: id, ...props as any})
        }),
        (dispatch: Dispatch<TAppState>, props: TProps) => ({
          setUIState: setUIStateSelector(dispatch, {uiStateId: id, ...props as any})
        }),
        transformPropsFunction
      )(
        // This any is ok, because the function overloading will catch errors relating to passing mismatching components
        // and transform functions
        Component as any // tslint:disable-line:no-any
      );
}
