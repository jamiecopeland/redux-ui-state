import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { defaultBranchSelector } from 'redux-ui-state';

// TODO export nicely
import { uiStateSelector, setUIStateSelector } from 'redux-ui-state/lib/utils';

import {
  DefaultStoreState,
  DispatchProps,
  StateProps,
  createDispatchProps,
  createStateProps,
  connectReduxUIState,
  createConnectReduxUIState
} from 'redux-ui-state';

import {
  UIState,
  CounterProps,
  CounterDynamicIdProps,
  TransformedProps,
  CounterTransformedProps,
  CounterRawProps,
} from './Counters';

// Transforms raw props into nice props
function transformProps(
  { uiState: { index }}: StateProps<UIState>,
  { setUIState }: DispatchProps<UIState>,
  { prefix }: CounterProps
) {
  return {
    message: `${prefix}${index}`,
    increment: () => setUIState({ index: index + 1 }),
    decrement: () => setUIState({ index: index - 1 }),
  };
}

//////////////////////////////////////////////////
// Connect with connectReduxUIState utility

// Using connectReduxUIState with transformed props (recommended) and a static id
export const CounterUtilTransformedPropsStaticId = connectReduxUIState<UIState, CounterProps, TransformedProps>(
  'counterRawStatic', transformProps
)(CounterTransformedProps);

// Using connectReduxUIState with transformed props (recommended) and a dynamic id
export const CounterUtilTranformedPropsDynamicId = connectReduxUIState<UIState, CounterDynamicIdProps, TransformedProps>( // tslint:disable-line:max-line-length
  ({ uiStateId }) =>  uiStateId, transformProps
)(CounterTransformedProps);

// Using connectReduxUIState with raw props and a static id
export const CounterUtilRawPropsStaticId = connectReduxUIState<UIState, CounterProps>(
  'counterTransformedStatic'
)(CounterRawProps);

// Using connectReduxUIState with raw props and a dynamic id
export const CounterUtilsRawPropsDynamicId = connectReduxUIState<UIState, CounterDynamicIdProps>(
  ({ uiStateId }) => uiStateId
)(CounterRawProps);

//////////////////////////////////////////////////
// Connect manually - Should be used when

// Manual connect with transformed props (recommended) and a static id
// export const CounterManualTransformedPropsStaticId = connect<StateProps<UIState>, DispatchProps<UIState>, CounterProps, TransformedProps>(
//   (state: DefaultStoreState, props: CounterProps) => ({
//     ...createStateProps()('counterManualStaticId', state, props)
//     // Add other state props here
//   }),
//   (dispatch: Dispatch<DefaultStoreState>, props: CounterProps) => ({
//     ...createDispatchProps('counterManualStaticId', dispatch, props)
//     // Add other dispatch props here
//   }),
//   transformProps
// )(CounterTransformedProps);

export const CounterManualTransformedPropsStaticId = connect<StateProps<UIState>, DispatchProps<UIState>, CounterProps, TransformedProps>(
  (state: DefaultStoreState, props: CounterProps) => ({
    uiState: uiStateSelector(state, { uiStateId: 'counterManualStaticId' })
    // Add other state props here
  }),
  (dispatch: Dispatch<DefaultStoreState>, props: CounterProps) => ({
    setUIState: setUIStateSelector(dispatch, { uiStateId: 'counterManualStaticId' })
    // Add other dispatch props here
  }),
  transformProps
)(CounterTransformedProps);

// Manual connect with transformed props (recommended) and a dynamic id
// export const CounterManualTransformedPropsDynamicId = connect<StateProps<UIState>, DispatchProps<UIState>, CounterDynamicIdProps, TransformedProps>(
//   (state: DefaultStoreState, props) => ({
//     // ...createStateProps()(({ uiStateId }) =>  uiStateId, state, props)
//     uiState: uiStateSelector(state, props)
//     // Add other state props here
//   }),
//   (dispatch: Dispatch<DefaultStoreState>, props) => ({
//     ...createDispatchProps(({ uiStateId }) =>  uiStateId, dispatch, props)
//     // Add other dispatch props here
//   }),
//   transformProps
// )(CounterTransformedProps);
export const CounterManualTransformedPropsDynamicId = connect<StateProps<UIState>, DispatchProps<UIState>, CounterDynamicIdProps, TransformedProps>(
  (state: DefaultStoreState, props) => ({
    uiState: uiStateSelector(state, props)
    // Add other state props here
  }),
  (dispatch: Dispatch<DefaultStoreState>, props) => ({
    setUIState: setUIStateSelector(dispatch, props)
    // Add other dispatch props here
  }),
  transformProps
)(CounterTransformedProps);

// Manual connect with raw props and a static id
export const CounterManualRawPropsStaticId = connect<StateProps<UIState>, DispatchProps<UIState>, CounterProps>(
  (state: DefaultStoreState, props: CounterProps) => ({
    ...createStateProps()('counterManualStaticId', state, props)
    // Add other state props here
  }),
  (dispatch: Dispatch<DefaultStoreState>, props: CounterProps) => ({
    ...createDispatchProps('counterManualStaticId', dispatch, props)
    // Add other dispatch props here
  })
)(CounterRawProps);

// Manual connect with raw props and a dynamic id
export const CounterManualRawPropsDynamicId = connect<StateProps<UIState>, DispatchProps<UIState>, CounterDynamicIdProps>(
  (state: DefaultStoreState, props) => ({
    ...createStateProps()(({ uiStateId }) =>  uiStateId, state, props)
    // Add other state props here
  }),
  (dispatch: Dispatch<DefaultStoreState>, props) => ({
    ...createDispatchProps(({ uiStateId }) =>  uiStateId, dispatch, props)
    // Add other dispatch props here
  })
)(CounterRawProps);
