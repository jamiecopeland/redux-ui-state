import * as React from 'react';
import { compose } from 'redux';

import {
  addReduxUIState,
  AddReduxUIStateConfig,
  createConnectWrapper,
  Props as ReduxUIStateProps,
} from 'redux-ui-state';

interface Props {
  initialValue: number;
}

interface UIState {
  index: number;
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
  id: 'counterUtil',
  getInitialState: ({ initialValue = 0 }) => ({ index: initialValue }),
};

export default compose(
  createConnectWrapper<Props>(),
  addReduxUIState<UIState, Props>(config)
)(Counter);
