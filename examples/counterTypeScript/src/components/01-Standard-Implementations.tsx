import * as React from 'react';

import {
  connectReduxUIState,
  Props as ReduxUIStateProps,
} from 'redux-ui-state';

// -------------------------------------------------------------------------------------------------
// Component acccepting raw props

interface UIState {
  index: number;
}

const CounterRawProps: React.StatelessComponent<ReduxUIStateProps<UIState>> = ({
  uiState, setUIState
}) => (
  <div>
    <div>
      {uiState.index}
    </div>
    <div>
      <button onClick={() => setUIState({ index: uiState.index - 1 })}>-</button>
      <button onClick={() => setUIState({ index: uiState.index + 1 })}>+</button>
    </div>
  </div>
);

// Counter static

export const CounterStatic = connectReduxUIState<UIState, {}>({
  id: 'counterStatic',
  initialState: { index: 0 },
})(CounterRawProps);

// Counter dynamic initial state

interface DynamicInitialStateProps {
  initialValue: number;
}

export const CounterDynamicInitialState =  connectReduxUIState<UIState, DynamicInitialStateProps>({
  id: 'counterDynamicInitialState',
  initialState: ({ initialValue }) => ({ index: initialValue }),
})(CounterRawProps);

// Counter dynamic id

interface DynamicIdProps {
  uiStateId: string;
}

export const CounterDynamicId = connectReduxUIState<UIState, DynamicIdProps>({
  id: ({ uiStateId }) => uiStateId,
  initialState: () => ({ index: 0 }),
})(CounterRawProps);

// -------------------------------------------------------------------------------------------------
// Component acccepting nice props

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

export const CounterTransformed = connectReduxUIState<UIState, {}, TransformedProps>({
  id: 'counterTransformed',
  initialState: () => ({ index: 0 }),
  transformProps: ({ index }, ownProps, { setUIState }) => ({
    message: `Index: ${index}`,
    increment: () => setUIState({ index: index + 1 }),
    decrement: () => setUIState({ index: index - 1 }),
  })
})(CounterNiceProps);

// Counter with transform

interface EverythingProps {
  initialValue: number;
  uiStateId: string;
  messagePrefix: string;
}

export const CounterEverything = connectReduxUIState<UIState, EverythingProps, TransformedProps>({
  id: ({ uiStateId }) => uiStateId,
  initialState: ({ initialValue }) => ({ index: initialValue }),
  transformProps: ({ index }, { messagePrefix }, { setUIState }) => ({
    message: `${messagePrefix} ${index}`,
    increment: () => setUIState({ index: index + 1 }),
    decrement: () => setUIState({ index: index - 1 }),
  })
})(CounterNiceProps);
