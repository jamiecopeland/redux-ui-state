import * as reactRedux from 'react-redux';
import * as utils from '../utils';
import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Action, Dispatch } from 'redux';
import { StatelessComponent } from 'react';

import { createConnectUIState } from '../connectUIState';
import {
  DEFAULT_BRANCH_NAME,
  Props as ReduxUIStateProps,
  defaultUIStateBranchSelector,
  uiStateBranchSelector,
  uiStateSelector
} from '../utils';
import { connect } from 'react-redux';
import { CounterTransformedProps } from '../../examples/counterTypeScript/src/components/Counters';
import { setUIStateSelector } from '../utils';

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

const uiStateSelectorMockOutput = { index: 0 };
const setUIStateSelectorMockOutput = () => undefined;

const restoreMocks = (mocks: { [key: string]: jest.Mock<any> | jest.SpyInstance<any> }) => // tslint:disable-line:no-any
  Object.keys(mocks).forEach(key => (mocks[key] as any).mockRestore()); // tslint:disable-line:no-any

describe('createConnectUIState', () => {

  interface UniversalAssertionMocks {
    connect: jest.SpyInstance<Function>;
    uiStateSelector: jest.Mock<Function>;
    setUIStateSelector: jest.Mock<Function>;
  }

  const runUniversalAssertions = (mocks: UniversalAssertionMocks) => {
    const [mapStateToProps, mapDispatchToProps] = jest.spyOn(reactRedux, 'connect').mock.calls[0];

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
  };

  it('should pass correct mapping functions to connect for raw props', () => {
    const mocks = {
      connect: jest.spyOn(reactRedux, 'connect'),
      uiStateSelector: jest.spyOn(utils, 'uiStateSelector').mockReturnValue(uiStateSelectorMockOutput),
      setUIStateSelector: jest.spyOn(utils, 'setUIStateSelector').mockReturnValue(setUIStateSelectorMockOutput),
    };

    createConnectUIState(defaultUIStateBranchSelector)(uiStateId)(
      CounterRaw
    );

    runUniversalAssertions(mocks);

    restoreMocks(mocks);
  });

  it('should pass the correct mapping functions to connect for transformed props', () => {
    const mocks = {
      connect: jest.spyOn(reactRedux, 'connect'),
      uiStateSelector: jest.spyOn(utils, 'uiStateSelector').mockReturnValue(uiStateSelectorMockOutput),
      setUIStateSelector: jest.spyOn(utils, 'setUIStateSelector').mockReturnValue(setUIStateSelectorMockOutput),
    };

    const transform = jest.fn();
    createConnectUIState(defaultUIStateBranchSelector)(uiStateId, transform)(
      CounterTransformedProps
    );

    runUniversalAssertions(mocks);

    const mergeProps = mocks.connect.mock.calls[0][2];
    expect(mergeProps)
      .toBe(transform);

    restoreMocks(mocks);
  });
});
