import * as React from 'react';

import { addReduxUIStateWithConnect } from 'redux-ui-state';
// import { AddReduxUIStateConfig } from 'redux-ui-state/lib/addReduxUIState';
// import { Props } from 'redux-ui-state/lib/Props';

interface UIState {
  index: number
}

interface Props<S> {
  uiState: S,
  setUIState: (uiState: S) => void,
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

const config = {
  id: 'counter',
  getInitialState: () => ({ index: 0 }),
};

export default addReduxUIStateWithConnect(config)(Counter);
