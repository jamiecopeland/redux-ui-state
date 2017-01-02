import * as React from 'react';

import { addReduxUIStateWithConnect } from 'redux-ui-state/lib/addReduxUIStateWithConnect';

import {
  addReduxUIState,
  AddReduxUIStateConfig,
  Props as ReduxUIStateProps,
} from 'redux-ui-state/lib/addReduxUIState';

interface Props {
  initialValue: number;
}

interface UIState {
  index: number
}

const Counter: React.StatelessComponent<Props & ReduxUIStateProps<UIState>> = ({
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

const config: AddReduxUIStateConfig<UIState, Props> = {
  id: 'counterAuto',
  getInitialState: ({ initialValue }) => ({ index: initialValue }),
};

export default addReduxUIStateWithConnect(config)(Counter);
