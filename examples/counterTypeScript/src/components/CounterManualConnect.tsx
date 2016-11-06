import * as React from 'react';
import { connect } from 'react-redux';

import { DEFAULT_BRANCH_NAME } from 'redux-ui-state';

import {
  Props, UIStateBranch, AddReduxUIStateConfig, addReduxUIState
} from 'redux-ui-state/lib/addReduxUIState';

interface UIState {
  index: number;
}

const Counter:React.StatelessComponent<Props<UIState>> = ({ uiState, setUIState }) => (
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

export const uiBranchSelector = state => state[DEFAULT_BRANCH_NAME];
export const mapDispatchToProps = (dispatch): any => ({ dispatch });
export const mapStateToProps = (state): any => ({ uiStateBranch: uiBranchSelector(state) });

const config: AddReduxUIStateConfig<UIState, {}> = {
  id: 'counter',
  getInitialState: () => ({ index: 0 }),
  destroyOnUnmount: false,
};

export default connect(mapStateToProps)(addReduxUIState<UIState, {}>(config)(Counter));
