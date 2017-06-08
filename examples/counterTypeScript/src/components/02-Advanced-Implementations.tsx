import * as React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import {
  createMapDispatchToProps,
  createUIStateSelector,
  createDispatchProps,
  createStateProps,
  StateProps
} from 'redux-ui-state/lib/utils';

import {
  DEFAULT_BRANCH_NAME,
  DefaultStoreState,
  DispatchProps,
  ExportedComponentDispatchProps,
  ExportedComponentStateProps,
  Props as ReduxUIStateProps,
  UIStateBranch,
} from 'redux-ui-state';

// Raw Component

interface CounterProps {
  message: string;
}

interface CounterDynamicIdProps extends CounterProps {
  uiStateId: string;
}

interface UIState {
  index: number;
}

const Counter: React.StatelessComponent<CounterProps & ReduxUIStateProps<UIState>> = ({
  message, uiState, setUIState
}) => (
  <div>
    <div>
      {message}{uiState.index}
    </div>
    <div>
      <button onClick={() => setUIState({ index: uiState.index - 1 })}>-</button>
      <button onClick={() => setUIState({ index: uiState.index + 1 })}>+</button>
    </div>
  </div>
);

// const stateSelector = createUIStateSelector<UIState, Props>('counterStatic');
// const dispatchSelector = createDispatchSelector<UIState, Props>('counterStatic');

export const CounterManualStaticId = connect<StateProps<UIState>, DispatchProps<UIState>, CounterProps>(
  (state: DefaultStoreState, props: CounterProps) => ({
    ...createStateProps('counterManualStaticId', state, props)
    // Add other state props here
  }),
  (dispatch: Dispatch<DefaultStoreState>, props: CounterProps) => ({
    ...createDispatchProps('counterManualStaticId', dispatch, props)
    // Add other dispatch props here
  })
)(Counter);

export const CounterManualDynamicId = connect<StateProps<UIState>, DispatchProps<UIState>, CounterDynamicIdProps>(
  (state: DefaultStoreState, props) => ({
    ...createStateProps(({ uiStateId }) =>  uiStateId, state, props)
    // Add other state props here
  }),
  (dispatch: Dispatch<DefaultStoreState>, props) => ({
    ...createDispatchProps(({ uiStateId }) =>  uiStateId, dispatch, props)
    // Add other dispatch props here
  })
)(Counter);
