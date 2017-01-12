import * as React from 'react';
import { mount } from 'enzyme';

import { StatelessComponent } from 'react';
import {
  Props as ReduxUIStateProps,
  addReduxUIState,
  ExportedComponentDispatchProps,
  ExportedComponentStateProps,
  AddReduxUIStateConfig,
  UIStateBranch
} from '../addReduxUIState';
import { setUIState, replaceUIState } from '../actions';
import { Action } from 'redux';

// Data fixture

interface UIState {
  index: number;
}

interface Props {
  initialIndex: number;
}

const componentId = 'thing';

const componentPropsFixture: Props = {
  initialIndex: 1
};

const uiStateFixture: UIState = {
  index: 666,
};

const reduxStateBranchFixture: UIStateBranch = {
  components: {
    [componentId]: uiStateFixture
  }
}

type AllProps = ExportedComponentStateProps & ExportedComponentDispatchProps & Props;

const getPropsFixture = (dispatch = jest.fn()): AllProps => ({
  ...componentPropsFixture,
  uiStateBranch: reduxStateBranchFixture,
  ownProps: componentPropsFixture,
  dispatch: jest.fn(),
});

const getWrapper = () => {
  const config: AddReduxUIStateConfig<UIState, Props> = {
    id: componentId,
    getInitialState: ({ initialIndex = 0 }) => ({ index: initialIndex }),
  };
  const Component = addReduxUIState<UIState, Props>(config)(TestComponent);
  const props = getPropsFixture();
  return {
    wrapper: mount(<Component {...props} />),
    dispatch: props.dispatch,
  };
}

// Component fixture

const TestComponent: StatelessComponent<Props & ReduxUIStateProps<UIState>> = (
  { uiState, setUIState, replaceUIState, resetUIState }
) => (
  <div>
    <span id="indexLabel">{uiState.index}</span>
    <button id="setUIStateButton" onClick={() => setUIState({ index: uiState.index + 1 })}>
      setState
    </button>
    <button id="replaceUIStateButton" onClick={() => replaceUIState({ index: uiState.index + 1 })}>
      replaceState
    </button>
    <button id="resetUIStateButton" onClick={() => resetUIState()}>
      replaceState
    </button>
  </div>
);

describe('addReduxUIState', () => {

  it('should recieve proxied props', () => {
    const { wrapper } = getWrapper();

    expect((wrapper.props() as AllProps).initialIndex).toEqual(componentPropsFixture.initialIndex);
  });

  it('should recieve correct uiState prop', () => {
    const { wrapper } = getWrapper();

    expect((wrapper.props() as AllProps).uiStateBranch).toEqual(reduxStateBranchFixture);
  });

  it('should recieve dispatch function', () => {
    const { wrapper } = getWrapper();
    expect(typeof wrapper.props().dispatch).toEqual('function');
  });

  it('should dispatch setUIState action on mount', () => {
    const { dispatch } = getWrapper();

    expect(dispatch).toHaveBeenCalledTimes(1);
    const action: Action = setUIState({
      id: componentId,
      state: {
        index: componentPropsFixture.initialIndex,
      }
    });
    expect(dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch setUIState action when setUIState prop is called', () => {
    const { wrapper, dispatch } = getWrapper();

    wrapper.find('#setUIStateButton').simulate('click');

    expect(dispatch).toHaveBeenCalledTimes(2);

    const action: Action = setUIState({
      id: componentId,
      state: {
        index: uiStateFixture.index + 1,
      }
    });
    expect(dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch replaceUIState action when replaceUIState prop is called', () => {
    const { wrapper, dispatch } = getWrapper();

    wrapper.find('#replaceUIStateButton').simulate('click');

    expect(dispatch).toHaveBeenCalledTimes(2);

    const action: Action = replaceUIState({
      id: componentId,
      state: {
        index: uiStateFixture.index + 1,
      }
    });
    expect(dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch setUIState when replaceUIState prop is called', () => {
    const { wrapper, dispatch } = getWrapper();

    wrapper.find('#replaceUIStateButton').simulate('click');

    expect(dispatch).toHaveBeenCalledTimes(2);

    const action: Action = replaceUIState({
      id: componentId,
      state: {
        index: uiStateFixture.index + 1,
      }
    });
    expect(dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch setUIState when replaceUIState prop is called', () => {
    const { wrapper, dispatch } = getWrapper();

    wrapper.find('#resetUIStateButton').simulate('click');

    expect(dispatch).toHaveBeenCalledTimes(2);

    const action: Action = replaceUIState({
      id: componentId,
      state: {
        index: componentPropsFixture.initialIndex,
      }
    });

    expect(dispatch).toHaveBeenCalledWith(action);
  });

});
