import * as React from 'react';
import { connect } from 'react-redux';

import {
  addReduxUIState,
  AddReduxUIStateConfig,
  DEFAULT_BRANCH_NAME,
  DispatchProps,
  ExportedComponentDispatchProps,
  ExportedComponentStateProps,
  Props as ReduxUIStateProps,
  UIStateBranch,
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

// NOTE: The mapStateToProps and uiBranchSelector functions are included here to be completely
// explicit about what's going on, but in most applications they should be be swapped out for the
// defaultMapStateToProps utility function provided by the library.
export const uiBranchSelector = (state): any => state[DEFAULT_BRANCH_NAME];
export const mapStateToProps = (state): any => (state, ownProps) => ({
  uiStateBranch: uiBranchSelector(state),
  ownProps
});

const config: AddReduxUIStateConfig<UIState, Props> = {
  id: 'counterManual',
  getInitialState: ({ initialValue = 0 }) => ({ index: initialValue }),
};

export default connect<
  ExportedComponentStateProps, ExportedComponentDispatchProps, Props
>(mapStateToProps)(addReduxUIState<UIState, Props>(config)(Counter));
