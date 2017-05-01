import * as React from 'react';

import {
  addReduxUIState,
  AddReduxUIStateConfig,
  Props as ReduxUIStateProps,
} from 'redux-ui-state/lib/addReduxUIState';

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

const config: AddReduxUIStateConfig<UIState, {}> = {
  id: 'counterStatic',
  initialState: { index: 0 },
};

export default addReduxUIState(config)(Counter);
