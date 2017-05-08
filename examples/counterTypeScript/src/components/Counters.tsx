import * as React from 'react';

import {
  addReduxUIState,
  Props as ReduxUIStateProps,
} from 'redux-ui-state/lib/addReduxUIState';

// -------------------------------------------------------------------------------------------------
// Raw component

interface UIState {
  index: number;
}

const Counter: React.StatelessComponent<ReduxUIStateProps<UIState>> = ({
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

// -------------------------------------------------------------------------------------------------
// Counter static

export const CounterStatic = addReduxUIState<UIState, {}>({
  id: 'counterStatic',
  initialState: { index: 0 },
})(Counter);

// -------------------------------------------------------------------------------------------------
// Counter dynamic initial state

interface DynamicInitialStateProps {
  initialValue: number;
}

export const CounterDynamicInitialState =  addReduxUIState<UIState, DynamicInitialStateProps>({
  id: 'counterDynamicInitialState',
  initialState: ({ initialValue }) => ({ index: initialValue }),
})(Counter);

// -------------------------------------------------------------------------------------------------
// Counter dynamic id

interface DynamicIdProps {
  uiStateId: string;
}

export const CounterDynamicId = addReduxUIState<UIState, DynamicIdProps>({
  id: ({ uiStateId }) => uiStateId,
  initialState: () => ({ index: 0 }),
})(Counter);

