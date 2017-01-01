import * as React from 'react';
import { compose } from 'redux';

import { createConnectWrapper } from 'redux-ui-state';
import { Props, AddReduxUIStateConfig, addReduxUIState } from 'redux-ui-state/lib/addReduxUIState';

interface UIState {
  index: number;
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
  destroyOnUnmount: false,
};

export default compose(
  createConnectWrapper(),
  addReduxUIState<any, any>(config)
)(Counter);
