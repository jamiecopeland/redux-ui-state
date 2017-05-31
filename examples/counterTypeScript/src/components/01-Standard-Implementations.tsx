import * as React from 'react';

import {
  connectReduxUIState,
  Props as ReduxUIStateProps,
} from 'redux-ui-state';

interface Props {
  message: string;
}

// -------------------------------------------------------------------------------------------------
// Component accepting nice props

interface TransformedProps {
  indexMessage: string;
  increment: () => void;
  decrement: () => void;
}

const CounterNiceProps: React.StatelessComponent<TransformedProps> = ({ indexMessage, increment, decrement }) => (
  <div>
    <div>
      {indexMessage}
    </div>
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  </div>
);

// Counter transfomed props

export const CounterTransformed = connectReduxUIState<UIState, Props, TransformedProps>(
  'counterTransformed',
  ({ index }, { setUIState }, { message }) => ({
    indexMessage: `${message}${index}`,
    increment: () => setUIState({ index: index + 1 }),
    decrement: () => setUIState({ index: index - 1 }),
  })
)(CounterNiceProps);

// -------------------------------------------------------------------------------------------------
// Component acccepting raw props

interface UIState {
  index: number;
}

const CounterRawProps: React.StatelessComponent<Props & ReduxUIStateProps<UIState>> = ({
  message, uiState, setUIState
}) => (
  <div>
    <div>
      {message}{uiState.index}
    </div>
    <div>
      <button onClick={() => setUIState({ index: uiState.index - 1 })}>-</button>
      <button onClick={() => setUIState({ index: uiState.index + 1 })}>+</button>
    </div>
  </div>
);

// Counter static id

export const CounterStatic = connectReduxUIState<UIState, Props>('counterStatic')(CounterRawProps);

// Counter dynamic id

interface DynamicIdProps extends Props {
  uiStateId: string;
}

export const CounterDynamicId = connectReduxUIState<UIState, DynamicIdProps>(
  ({ uiStateId }) => uiStateId
)(CounterRawProps);
