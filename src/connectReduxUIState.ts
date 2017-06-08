import { ComponentClass } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  WrappedComponentWithTransform, WrappedComponentWithoutTransform,
  DefaultStoreState,
  Id, TransformPropsFunction2,
  UIStateBranchSelector,
  createStateProps,
  createDispatchProps
} from './utils';

export function connectReduxUIState<TUIState, TProps, TAppState = DefaultStoreState>(
  id: Id<TProps>,
  uiStateBranchSelector?: UIStateBranchSelector<TAppState>
): (Component: WrappedComponentWithoutTransform<TUIState, TProps>) =>
  React.ComponentClass<TProps>;

export function connectReduxUIState<TUIState, TProps, TTransformedProps, TAppState = DefaultStoreState>(
  id: Id<TProps>,
  transformPropsFunction: TransformPropsFunction2<TUIState, TProps, TTransformedProps>,
  uiStateBranchSelector?: UIStateBranchSelector<TAppState>
): (Component: WrappedComponentWithTransform<TUIState, TProps, TTransformedProps>) => React.ComponentClass<TProps>;

export function connectReduxUIState<TUIState, TProps, TTransformedProps, TAppState = DefaultStoreState>(
  id: Id<TProps>,
  transformPropsFunction?: TransformPropsFunction2<TUIState, TProps, TTransformedProps>,
  uiStateBranchSelector?: UIStateBranchSelector<TAppState>
) {
    return (
      Component: WrappedComponentWithoutTransform<TUIState, TProps>
        | WrappedComponentWithTransform<TUIState, TProps, TTransformedProps>
    ): ComponentClass<TProps> => connect(
      (state: TAppState, props: TProps) => createStateProps<TProps, TAppState>(
        id, state, props, uiStateBranchSelector
      ),
      (dispatch: Dispatch<TAppState>, props: TProps) => createDispatchProps(id, dispatch, props),
      transformPropsFunction
    )(Component as any);
  }
