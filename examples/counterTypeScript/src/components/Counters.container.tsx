import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  DefaultStoreState,
  DispatchProps,
  StateProps,
  connectReduxUIState,
  uiStateSelector,
  setUIStateSelector,
  TransformPropsFunction
} from 'redux-ui-state';

import {
  UIState,
  CounterProps,
  CounterDynamicIdProps,
  TransformedProps,
  CounterTransformedProps,
  CounterRawProps,
} from './Counters';

import {
  utilTransformedStatic,
  utilRawStatic,
  manualTransformedStatic,
  manualRawStatic,
} from '../uiState';

/**
 * Transforms the raw Redux UI State API into a nicer, more contextually shape
 * @param uiState
 * @param setUIState
 * @param props
 */
const transformProps: TransformPropsFunction<UIState, CounterProps, TransformedProps> = (
  { uiState: { index } }, { setUIState }, { prefix }
) => ({
  message: `${prefix}${index}`,
  increment: () => setUIState({ index: index + 1 }),
  decrement: () => setUIState({ index: index - 1 }),
});

//////////////////////////////////////////////////
// Connect with connectReduxUIState utility

// Using connectReduxUIState with transformed props (recommended) and a static id
export const CounterUtilTransformedPropsStaticId = connectReduxUIState<UIState, CounterProps, TransformedProps>(
  'utilTransformedStatic', transformProps
)(CounterTransformedProps);

// Using connectReduxUIState with transformed props (recommended) and a dynamic id
export const CounterUtilTranformedPropsDynamicId = connectReduxUIState<UIState, CounterDynamicIdProps, TransformedProps>( // tslint:disable-line:max-line-length
  ({ uiStateId }) =>  uiStateId, transformProps
)(CounterTransformedProps);

// Using connectReduxUIState with raw props and a static id
export const CounterUtilRawPropsStaticId = connectReduxUIState<UIState, CounterProps>(
  'utilRawStatic'
)(CounterRawProps);

// Using connectReduxUIState with raw props and a dynamic id
export const CounterUtilsRawPropsDynamicId = connectReduxUIState<UIState, CounterDynamicIdProps>(
  ({ uiStateId }) => uiStateId
)(CounterRawProps);

//////////////////////////////////////////////////
// Connect manually - Should be used when

// Manual connect with transformed props (recommended) and a static id
const manualTransformedStaticId = 'manualTransformedStatic';
export const CounterManualTransformedPropsStaticId = (
  connect<StateProps<UIState>, DispatchProps<UIState>, CounterProps, TransformedProps>(
    (state: DefaultStoreState, props: CounterProps) => ({
      uiState: uiStateSelector(state, { uiStateId: manualTransformedStaticId })
      // Add other state props here
    }),
    (dispatch: Dispatch<DefaultStoreState>, props: CounterProps) => ({
      setUIState: setUIStateSelector(dispatch, { uiStateId: manualTransformedStaticId })
      // Add other dispatch props here
    }),
    transformProps
  )(CounterTransformedProps)
);

// Manual connect with transformed props (recommended) and a dynamic id
export const CounterManualTransformedPropsDynamicId = (
  connect<StateProps<UIState>, DispatchProps<UIState>, CounterDynamicIdProps, TransformedProps>(
    (state: DefaultStoreState, props) => ({
      uiState: uiStateSelector(state, props)
      // Add other state props here
    }),
    (dispatch: Dispatch<DefaultStoreState>, props) => ({
      setUIState: setUIStateSelector(dispatch, props)
      // Add other dispatch props here
    }),
    transformProps
  )(CounterTransformedProps)
);

// Manual connect with raw props and a static id
const manualRawStaticId = 'manualRawStatic';
export const CounterManualRawPropsStaticId = (
  connect<StateProps<UIState>, DispatchProps<UIState>, CounterProps>(
    (state: DefaultStoreState, props: CounterProps) => ({
      uiState: uiStateSelector(state, { uiStateId: manualRawStaticId })
      // Add other state props here
    }),
    (dispatch: Dispatch<DefaultStoreState>, props: CounterProps) => ({
      setUIState: setUIStateSelector(dispatch, { uiStateId: manualRawStaticId })
      // Add other dispatch props here
    })
  )(CounterRawProps)
);

// Manual connect with raw props and a dynamic id
export const CounterManualRawPropsDynamicId = (
  connect<StateProps<UIState>, DispatchProps<UIState>, CounterDynamicIdProps>(
    (state: DefaultStoreState, props) => ({
      uiState: uiStateSelector(state, props)
      // Add other state props here
    }),
    (dispatch: Dispatch<DefaultStoreState>, props) => ({
      setUIState: setUIStateSelector(dispatch, props)
      // Add other dispatch props here
    })
  )(CounterRawProps)
);
