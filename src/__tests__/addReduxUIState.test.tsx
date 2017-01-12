import * as React from 'react';
import { mount } from 'enzyme';

import { StatelessComponent } from 'react';
import { Props as ReduxUIStateProps, addReduxUIState, ExportedComponentDispatchProps, ExportedComponentStateProps, AddReduxUIStateConfig, UIStateBranch } from '../addReduxUIState';
import { setUIState } from '../actions';
import { Action } from 'redux';

// Component fixture

const TestComponent: StatelessComponent<Props & ReduxUIStateProps<UIState>> = ({ uiState, setUIState }) => (
  <div>
    <span id="indexLabel">{uiState.index}</span>
    <button id="setUIStateButton" onClick={() => setUIState({ index: uiState.index + 1 })}>
      increment
    </button>

  </div>
);

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
}

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

  it('should dispatch setUIState on mount', () => {
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

  it('should dispatch setUIState on mount', () => {
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

});
