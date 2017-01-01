import * as React from 'react';

import { addReduxUIStateWithConnect } from 'redux-ui-state/lib/addReduxUIStateWithConnect';

import { Props, AddReduxUIStateConfig, addReduxUIState } from 'redux-ui-state/lib/addReduxUIState';

interface UIState {
  index: number
}

const Counter: React.StatelessComponent<Props<UIState>> = ({ uiState, setUIState }) => (
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
  id: 'counter',
  getInitialState: () => ({ index: 0 }),
};

export default addReduxUIStateWithConnect(config)(Counter);
