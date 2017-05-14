import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  addReduxUIState,
  AddReduxUIStateConfig,
  DEFAULT_BRANCH_NAME,
  DefaultStateShape,
  DispatchProps,
  ExportedComponentDispatchProps,
  ExportedComponentStateProps,
  Props as ReduxUIStateProps,
  UIStateBranch,
  createConnectWrapper,
} from 'redux-ui-state';

// Raw Component

interface Props {
  initialValue: number;
}

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

// Using the createConnectWrapper utility to connect to the store

export const CounterUtil = compose(
  createConnectWrapper<Props, DefaultStateShape>(),
  addReduxUIState<UIState, Props>({
    id: 'counterUtil',
    initialState: ({ initialValue }) => ({ index: initialValue }),
  })
)(Counter);

// Manually connecting to the store

// NOTE: The mapStateToProps and uiBranchSelector functions are included here to be completely
// explicit about what's going on, but in most applications they should be be swapped out for the
// defaultMapStateToProps utility function provided by the library.
export function uiBranchSelector<TAppState>(state: TAppState): UIStateBranch {
  return state[DEFAULT_BRANCH_NAME];
};
export function mapStateToProps<TAppState>(state: TAppState, ownProps: Props) {
  return ({
    uiStateBranch: uiBranchSelector(state),
    ownProps
  });
}

export const CounterManual = connect<
  ExportedComponentStateProps, ExportedComponentDispatchProps, Props
>(mapStateToProps)(addReduxUIState<UIState, Props>({
  id: 'counterManual',
  initialState: ({ initialValue }) => ({ index: initialValue }),
})(Counter));
