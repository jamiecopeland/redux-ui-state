import * as reactRedux from 'react-redux';
import * as utils from '../utils';
import * as React from 'react';
import { setupConnectUIState } from '../connectUIState';
import {
  Props as ReduxUIStateProps,
  defaultUIStateBranchSelector,
} from '../utils';
import { MappedProps, UIState } from './componentTestUtils';

export interface CounterProps {
  prefix: string;
}

export type RawProps = CounterProps & ReduxUIStateProps<UIState>;

export const CounterMapped: React.StatelessComponent<MappedProps> = ({
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

export const uiStateId = 'counter';
export const initialState = {
  [uiStateId]: 0
};

const uiStateSelectorMockOutput = { index: 0 };
const setUIStateSelectorMockOutput = () => undefined;

const restoreMocks = (mocks: { [key: string]: jest.Mock<any> | jest.SpyInstance<any> }) => // tslint:disable-line:no-any
  Object.keys(mocks).forEach(key => (mocks[key] as any).mockRestore()); // tslint:disable-line:no-any

describe('setupConnectUIState', () => {

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

    setupConnectUIState(defaultUIStateBranchSelector)(uiStateId)(
      CounterRaw
    );

    runUniversalAssertions(mocks);

    restoreMocks(mocks);
  });

  it('should pass the correct mapping functions to connect for mapped props', () => {
    const mocks = {
      connect: jest.spyOn(reactRedux, 'connect'),
      uiStateSelector: jest.spyOn(utils, 'uiStateSelector').mockReturnValue(uiStateSelectorMockOutput),
      setUIStateSelector: jest.spyOn(utils, 'setUIStateSelector').mockReturnValue(setUIStateSelectorMockOutput),
    };

    const mapPropsOutput = { message: 'I have been mapped' };
    const mapProps = jest.fn().mockReturnValue(mapPropsOutput);
    setupConnectUIState(defaultUIStateBranchSelector)(uiStateId, mapProps)(CounterMapped);

    runUniversalAssertions(mocks);
    const [mapStateToProps, mapDispatchToProps, mergeProps] = jest.spyOn(reactRedux, 'connect').mock.calls[0];
    
    const ownProps = { someOtherValue: 'Hello World!' };
    const mergedProps = mergeProps(mapStateToProps(), mapDispatchToProps(), ownProps);
    
    expect(mapProps.mock.calls[0]).toEqual([
      { ...mapStateToProps(), ...mapDispatchToProps() },
      ownProps
    ]);

    expect(mergedProps).toEqual(mapPropsOutput);

    restoreMocks(mocks);
  });
});
