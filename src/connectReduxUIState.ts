import { ComponentClass } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
// Fix this
import { uiStateSelector, setUIStateSelector, UIStateBranchSelector } from './utils';

import {
  WrappedComponentWithTransform, WrappedComponentWithoutTransform,
  DefaultStoreState,
  Id, TransformPropsFunction,
  // UIStateBranchSelector,
  // createStateProps,
  // createDispatchProps
} from './utils';

export interface connectReduxUIState { // tslint:disable-line:class-name
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

export const connectReduxUIState: connectReduxUIState = <TUIState, TProps, TTransformedProps, TAppState = DefaultStoreState>(
  id: Id<TProps>,
  transformPropsFunction?: TransformPropsFunction<TUIState, TProps, TTransformedProps>,
  uiStateBranchSelector?: UIStateBranchSelector<TAppState>
) => (
  Component: WrappedComponentWithoutTransform<TUIState, TProps> | WrappedComponentWithTransform<TUIState, TProps, TTransformedProps> // tslint:disable-line:max-line-length
): ComponentClass<TProps> => connect( // TODO Add generics to connect?
    (state: TAppState, props: TProps) => ({
      uiState: uiStateSelector(state, {uiStateId: id, uiStateBranchSelector,  ...props as any})
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
