import * as reactRedux from 'react-redux';
import * as utils from '../utils';
import * as React from 'react';
// import { uiStateId, UIState } from './components';
import { setupCreateUIState } from '../createUIState';

import {
  Props as ReduxUIStateProps,
  defaultUIStateBranchSelector,
} from '../utils';
import { createMocks, runUniversalAssertions, UIState, uiStateId } from './componentTestUtils';

const restoreMocks = (mocks: { [key: string]: jest.Mock<any> | jest.SpyInstance<any> }) => // tslint:disable-line:no-any
  Object.keys(mocks).forEach(key => (mocks[key] as any).mockRestore()); // tslint:disable-line:no-any

const unmappedRenderProp = (props: utils.Props<UIState>) => null;
const mappedRenderProp = (props: utils.Props<UIState>) => null;

describe('setupConnectUIState', () => {

  it('should pass correct mapping functions to connect for raw props', () => {
    const mocks = createMocks();

    setupCreateUIState(defaultUIStateBranchSelector)(uiStateId);

    runUniversalAssertions(mocks);

    restoreMocks(mocks);
    
  });

  it('should pass the correct mapping functions to connect for mapped props', () => {
    const mocks = createMocks();

    const mapPropsOutput = { message: 'I have been mapped' };
    const mapProps = jest.fn().mockReturnValue(mapPropsOutput);
    setupCreateUIState(defaultUIStateBranchSelector)(uiStateId, mapProps);

    runUniversalAssertions(mocks);
    const [mapStateToProps, mapDispatchToProps, mergeProps] = jest.spyOn(reactRedux, 'connect').mock.calls[0];
    
    const mergedProps = mergeProps(mapStateToProps(), mapDispatchToProps());

    expect(mergedProps).toEqual(mapPropsOutput);

    restoreMocks(mocks);
  });
});
