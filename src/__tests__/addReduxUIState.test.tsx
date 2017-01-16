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

interface StateProps {
  initialIndex: number;
}

interface DispatchProps {
  onSomething: Function;
}

const componentId = 'thing';

const componentStatePropsFixture: StateProps = {
  initialIndex: 1,
};

const componentDispatchPropsFixture: DispatchProps = {
  onSomething: () => '',
};

const uiStateFixture: UIState = {
  index: 666,
};

const reduxStateBranchFixture: UIStateBranch = {
  components: {
    [componentId]: uiStateFixture
  }
};

type AllProps = ExportedComponentStateProps & ExportedComponentDispatchProps & StateProps & DispatchProps;

const getPropsFixture = (dispatch = jest.fn()): AllProps => ({
  ...componentStatePropsFixture,
  ...componentDispatchPropsFixture,
  uiStateBranch: reduxStateBranchFixture,
  dispatch: jest.fn(),
});

// Component fixture

const TestComponent: StatelessComponent<StateProps & DispatchProps & ReduxUIStateProps<UIState>> = (
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

const getWrapper = () => {
  const config: AddReduxUIStateConfig<UIState, StateProps> = {
    id: componentId,
    getInitialState: ({ initialIndex = 0 }) => ({ index: initialIndex }),
  };
  const Component = addReduxUIState<UIState, StateProps>(config)(TestComponent);
  const props = getPropsFixture();
  return {
    wrapper: mount(<Component {...props} />),
    dispatch: props.dispatch,
  };
};

describe('addReduxUIState', () => {

  it('should recieve proxied props', () => {
    const { wrapper } = getWrapper();
    expect((wrapper.find(TestComponent).props()).initialIndex).toEqual(componentStatePropsFixture.initialIndex);
    expect((wrapper.find(TestComponent).props()).onSomething).toEqual(componentDispatchPropsFixture.onSomething);
  });

  it('should recieve correct uiState prop', () => {
    const { wrapper } = getWrapper();

    expect(((wrapper.find(TestComponent).props())).uiState).toEqual(uiStateFixture);
  });

  it('should recieve setUIState function', () => {
    const { wrapper } = getWrapper();
    expect(typeof wrapper.find(TestComponent).props().setUIState).toEqual('function');
  });

  it('should recieve replaceUIState function', () => {
    const { wrapper } = getWrapper();
    expect(typeof wrapper.find(TestComponent).props().setUIState).toEqual('function');
  });

  it('should recieve resetUIState function', () => {
    const { wrapper } = getWrapper();
    expect(typeof wrapper.find(TestComponent).props().setUIState).toEqual('function');
  });

  it('should recieve destroyUIState function', () => {
    const { wrapper } = getWrapper();
    expect(typeof wrapper.find(TestComponent).props().destroyUIState).toEqual('function');
  });

  it('should pass existingState argument to getInitialState', () => {
    const config: AddReduxUIStateConfig<UIState, StateProps> = {
      id: componentId,
      getInitialState: jest.fn(),
    };
    const Component = addReduxUIState<UIState, StateProps>(config)(TestComponent);
    mount(<Component {...getPropsFixture()} />);

    expect(config.getInitialState)
      .toBeCalledWith((expect as any).anything(), uiStateFixture); // tslint:disable-line:no-any
  });

  it('should dispatch setUIState action on mount', () => {
    const { dispatch } = getWrapper();

    expect(dispatch).toHaveBeenCalledTimes(1);
    const action: Action = setUIState({
      id: componentId,
      state: {
        index: componentStatePropsFixture.initialIndex,
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
        index: componentStatePropsFixture.initialIndex,
      }
    });

    expect(dispatch).toHaveBeenCalledWith(action);
  });

});
