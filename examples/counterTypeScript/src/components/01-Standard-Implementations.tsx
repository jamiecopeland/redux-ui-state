import * as React from 'react';

import {
  connectReduxUIState,
  Props as ReduxUIStateProps,
} from 'redux-ui-state';
import { DefaultStoreState } from 'redux-ui-state/lib/utils';

interface UIState {
  index: number;
}

interface CounterProps {
  prefix: string;
}

interface CounterDynamicIdProps extends CounterProps {
  uiStateId: string;
}

// -------------------------------------------------------------------------------------------------
// Component accepting nice props

interface TransformedProps {
  message: string;
  increment: () => void;
  decrement: () => void;
}

const CounterNiceProps: React.StatelessComponent<TransformedProps> = ({ message, increment, decrement }) => (
  <div>
    <div>
      {message}
    </div>
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  </div>
);

export const CounterTranformedPropsStaticId = connectReduxUIState<UIState, CounterProps, TransformedProps>(
  'counterRawStatic',
  ({ uiState: { index }}, { setUIState }, { prefix }) => ({
    message: `${prefix}${index}`,
    increment: () => setUIState({ index: index + 1 }),
    decrement: () => setUIState({ index: index - 1 }),
  })
)(CounterNiceProps);

export const CounterTranformedPropsDynamicId = connectReduxUIState<UIState, CounterDynamicIdProps, TransformedProps>(
  ({ uiStateId }) =>  uiStateId,
  ({ uiState: { index } }, { setUIState }, { prefix }) => ({
    message: `${prefix}${index}`,
    increment: () => setUIState({ index: index + 1 }),
    decrement: () => setUIState({ index: index - 1 }),
  })
)(CounterNiceProps);

// -------------------------------------------------------------------------------------------------
// Component acccepting raw props

const CounterRawProps: React.StatelessComponent<CounterProps & ReduxUIStateProps<UIState>> = ({
  prefix, uiState, setUIState
}) => (
  <div>
    <div>
      {prefix}{uiState.index}
    </div>
    <div>
      <button onClick={() => setUIState({ index: uiState.index - 1 })}>-</button>
      <button onClick={() => setUIState({ index: uiState.index + 1 })}>+</button>
    </div>
  </div>
);

export const CounterRawPropsStaticId = connectReduxUIState<UIState, CounterProps>(
  'counterTransformedStatic'
)(CounterRawProps);

export const CounterRawPropsDynamicId = connectReduxUIState<UIState, CounterDynamicIdProps>(
  ({ uiStateId }) => uiStateId
)(CounterRawProps);
