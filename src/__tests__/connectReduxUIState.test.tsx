// Mocks need to come before imports

const connectMockOutput = () => () => undefined;
const uiStateSelectorMockOutput = { index: 0 };
const setUIStateSelectorMockOutput = () => undefined;

const mocks = {
  connect: jest.fn().mockImplementation(connectMockOutput),
  uiStateSelector: jest.fn().mockReturnValue(uiStateSelectorMockOutput),
  setUIStateSelector: jest.fn().mockReturnValue(setUIStateSelectorMockOutput),
};

const resetMocks = () => Object.keys(mocks).map(key => mocks[key].mockClear());

const utils = require('../utils');

jest.mock('react-redux', () => ({
  connect: mocks.connect
}));

jest.mock('../utils', () => ({
  ...utils,
  uiStateSelector: mocks.uiStateSelector,
  setUIStateSelector: mocks.setUIStateSelector
}));

// Imports need to come after mocks
import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Action, Dispatch } from 'redux';
import { StatelessComponent } from 'react';

import { createConnectReduxUIState } from '../connectReduxUIState';
import {
  Props as ReduxUIStateProps,
  defaultUIStateBranchSelector,
  uiStateBranchSelector,
  uiStateSelector
} from '../utils';
import { DEFAULT_BRANCH_NAME } from '../constants';
import { connect } from 'react-redux';
import { CounterTransformedProps } from '../../examples/counterTypeScript/src/components/Counters';

export interface UIState {
  index: number;
}

export interface CounterProps {
  prefix: string;
}

// export interface CounterDynamicIdProps extends CounterProps {
//   uiStateId: string;
// }

export interface NiceProps {
  message: string;
  increment: () => void;
  decrement: () => void;
}

export type RawProps = CounterProps & ReduxUIStateProps<UIState>;

export const CounterNice: React.StatelessComponent<NiceProps> = ({
  message,
  increment,
  decrement
}) =>
  <div>
    <div>
      {message}
    </div>
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  </div>;

export const CounterRaw: React.StatelessComponent<RawProps> = ({
  prefix,
  uiState,
  setUIState
}) =>
  <div>
    <div>
      {prefix}{uiState.index}
    </div>
    <div>
      <button onClick={() => setUIState({ index: uiState.index - 1 })}>
        -
      </button>
      <button onClick={() => setUIState({ index: uiState.index + 1 })}>
        +
      </button>
    </div>
  </div>;

const uiStateId = 'counter';
const initialState = {
  [uiStateId]: 0
};

describe.only('createConnectReduxUIState', () => {

  beforeEach(() => {
    resetMocks();
  });

  const runUniversalAssertions = () => {
    const [mapStateToProps, mapDispatchToProps] = mocks.connect.mock.calls[0];

    expect(mocks.connect).toHaveBeenCalledTimes(1);

    expect(mapStateToProps())
      .toEqual({ uiState: uiStateSelectorMockOutput });
    expect(mocks.uiStateSelector)
      .toBeCalledWith(
        undefined,
        {
          uiStateBranchSelector: defaultUIStateBranchSelector,
          uiStateId
        }
      );

    expect(mapDispatchToProps())
      .toEqual({
        setUIState: setUIStateSelectorMockOutput
      });
    expect(mocks.setUIStateSelector)
      .toBeCalledWith(undefined, { uiStateId });
  }

  it('should pass correct mapping functions to connect for raw props', () => {
    createConnectReduxUIState(defaultUIStateBranchSelector)(uiStateId)(
      CounterRaw
    );

    runUniversalAssertions();
  });

  it('should pass the correct mapping functions to connect for transformed props', () => {
    const transform = jest.fn();
    createConnectReduxUIState(defaultUIStateBranchSelector)(uiStateId, transform)(
      CounterTransformedProps
    );

    runUniversalAssertions();

    const mergeProps = mocks.connect.mock.calls[0][2];
    expect(mergeProps)
      .toBe(transform);
  });
});
