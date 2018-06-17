import * as reactRedux from 'react-redux';

import * as utils from '../utils';
import { defaultUIStateBranchSelector } from '../utils';

export interface UIState {
  index: number;
}

export interface MappedProps {
  message: string;
  increment: () => void;
  decrement: () => void;
}

export const uiStateId = 'counter';
export const initialState = { [uiStateId]: 0 };

export interface UniversalAssertionMocks {
  connect: jest.SpyInstance<Function>;
  uiStateSelector: jest.Mock<Function>;
  setUIStateSelector: jest.Mock<Function>;
}

const uiStateSelectorMockOutput = { index: 0 };
const setUIStateSelectorMockOutput = () => undefined;

export const runUniversalAssertions = (mocks: UniversalAssertionMocks) => {
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

export const createMocks = () => ({
  connect: jest.spyOn(reactRedux, 'connect'),
  uiStateSelector: jest.spyOn(utils, 'uiStateSelector').mockReturnValue(uiStateSelectorMockOutput),
  setUIStateSelector: jest.spyOn(utils, 'setUIStateSelector').mockReturnValue(setUIStateSelectorMockOutput),
});