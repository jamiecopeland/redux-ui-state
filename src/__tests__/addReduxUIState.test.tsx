import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Action, Dispatch } from 'redux';

import { StatelessComponent } from 'react';
import {
  Props as ReduxUIStateProps,
  addReduxUIState,
  ExportedComponentDispatchProps,
  ExportedComponentStateProps,
  AddReduxUIStateConfig,
  UIStateBranch,
  setUIState, replaceUIState, destroyUIState
} from '../index';
// TODO Check if these should be exported from index
import { Id, InitialState, InitialStateFunction, DefaultStateShape, DispatchProps } from '../utils';

// Data fixture

interface UIState {
  index: number;
  isActive: boolean;
}

interface CustomStateProps {
  uiStateId: string;
  initialIndex: number;
}

interface CustomDispatchProps {
  onSomethingUnrelated: () => void;
}

const componentId = 'thing';

const initialUIStateFixture: UIState = {
  index: 666,
  isActive: false,
};

const componentStatePropsFixture: CustomStateProps = {
  uiStateId: componentId,
  initialIndex: 0,
};
const initialIsActive = true;

const componentDispatchPropsFixture: CustomDispatchProps = {
  onSomethingUnrelated: () => undefined,
};

const reduxStateBranchFixture: UIStateBranch = {
  components: {
    [componentId]: initialUIStateFixture
  }
};

type AllProps = ExportedComponentStateProps & ExportedComponentDispatchProps & CustomStateProps & CustomDispatchProps;

const getPropsFixture = (dispatch = jest.fn()): AllProps => ({
  ...componentStatePropsFixture,
  ...componentDispatchPropsFixture,
  uiStateBranch: reduxStateBranchFixture,
  dispatch: jest.fn(),
});

// Component fixture

const TestComponent: StatelessComponent<CustomStateProps & CustomDispatchProps & ReduxUIStateProps<UIState>> = (
  { uiState, setUIState, replaceUIState, resetUIState, destroyUIState }
) => (
  <div>
    <span id="indexLabel">{uiState.index}</span>
    <button id="setUIStateButton" onClick={() => setUIState({ index: uiState.index + 1 })}>
      setState
    </button>
    <button id="replaceUIStateButton" onClick={() => replaceUIState({ index: uiState.index + 1, isActive: true })}>
      replaceState
    </button>
    <button id="resetUIStateButton" onClick={() => resetUIState()}>
      replaceState
    </button>
    <button id="destroyUIStateButton" onClick={() => destroyUIState()}>
      replaceState
    </button>
  </div>
);

const wrapperFixtureStateValues = {
  index: 0,
  isActive: false,
};

const wrapperFixture = {
  staticIdFixture: componentId,
  dynamicIdFixture: ({ uiStateId = componentId }) => uiStateId,
  staticUIState: wrapperFixtureStateValues,
  dynamicUIState: ({ initialIndex = wrapperFixtureStateValues.index }) => ({
    index: initialIndex,
    isActive: wrapperFixtureStateValues.isActive
  }),
};

// const staticIdFixture: Id<StateProps> = componentId;
// const dynamicIdFixture: Id<StateProps>  = ({ uiStateId = componentId }) => uiStateId;
// const staticUIState: InitialState<UIState, StateProps> = { index: 0, isActive: false };
// const dynamicUIState: InitialStateFunction<UIState, StateProps>  = ({ initialIndex = 0 }) => ({
//   index: initialIndex,
//   isActive: initialIsActive
// });

interface GetWrapperOutput {
  dispatch: jest.Mock<Action>;
  wrapper: ReactWrapper<CustomStateProps & CustomDispatchProps, void>;
  onUnmountMock: jest.Mock<void>;
}

const getWrapper = (
  id: Id<CustomStateProps>,
  initialState: InitialState<UIState, CustomStateProps> | InitialStateFunction<UIState, CustomStateProps>,
): GetWrapperOutput => {
  const onUnmountMock = jest.fn<void>();
  const config: AddReduxUIStateConfig<UIState, CustomStateProps> = {
    id,
    initialState,
    onUnmount: onUnmountMock,
  };
  const Component = addReduxUIState<UIState, CustomStateProps & CustomDispatchProps>(config)(TestComponent);
  const props = getPropsFixture();

  return {
    wrapper: mount(<Component {...props} />),
    dispatch: props.dispatch as jest.Mock<Action>,
    onUnmountMock,
  };
};

describe('addReduxUIState', () => {

  const runGlobalTests = (getSpecificWrapper: () => GetWrapperOutput) => {
    it('should recieve proxied props', () => {
      const { wrapper } = getSpecificWrapper();
      expect((wrapper.find(TestComponent).props()).initialIndex)
        .toEqual(componentStatePropsFixture.initialIndex);
      expect((wrapper.find(TestComponent).props()).onSomethingUnrelated)
        .toEqual(componentDispatchPropsFixture.onSomethingUnrelated);
    });

    it('should recieve correct uiState prop ', () => {
      const { wrapper } = getSpecificWrapper();
      expect(((wrapper.find(TestComponent).props())).uiState).toEqual(initialUIStateFixture);
    });

    it('should recieve setUIState function', () => {
      const { wrapper } = getSpecificWrapper();
      expect(typeof wrapper.find(TestComponent).props().setUIState).toEqual('function');
    });

    it('should recieve replaceUIState function', () => {
      const { wrapper } = getSpecificWrapper();
      expect(typeof wrapper.find(TestComponent).props().setUIState).toEqual('function');
    });

    it('should recieve resetUIState function', () => {
      const { wrapper } = getSpecificWrapper();
      expect(typeof wrapper.find(TestComponent).props().setUIState).toEqual('function');
    });

    it('should recieve destroyUIState function', () => {
      const { wrapper } = getSpecificWrapper();
      expect(typeof wrapper.find(TestComponent).props().destroyUIState).toEqual('function');
    });

    it('should dispatch setUIState action when setUIState prop is called', () => {
      const { wrapper, dispatch } = getSpecificWrapper();

      wrapper.find('#setUIStateButton').simulate('click');

      const action: Action = setUIState({
        id: componentId,
        state: {
          index: initialUIStateFixture.index + 1,
        }
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(action);
    });

    it('should dispatch replaceUIState action when replaceUIState prop is called', () => {
      const { wrapper, dispatch } = getSpecificWrapper();

      wrapper.find('#replaceUIStateButton').simulate('click');

      const action: Action = replaceUIState({
        id: componentId,
        state: {
          index: initialUIStateFixture.index + 1,
          isActive: true
        }
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1][0]).toEqual(action);
    });

    it('should dispatch resetUIState when resetUIState prop is called', () => {
      const { wrapper, dispatch } = getSpecificWrapper();

      wrapper.find('#resetUIStateButton').simulate('click');

      const action: Action = replaceUIState({
        id: componentId,
        state: wrapperFixtureStateValues
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1][0]).toEqual(action);
    });

    it('should dispatch destroyUIState when destroyUIState prop is called', () => {
      const { wrapper, dispatch } = getSpecificWrapper();

      wrapper.find('#destroyUIStateButton').simulate('click');

      const action: Action = destroyUIState({
        id: componentId,
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1][0]).toEqual(action);
    });

    it('should call onUnmount on unmount - setUIState', () => {
      const { wrapper, dispatch, onUnmountMock } = getSpecificWrapper();
      const uiState: Partial<UIState> = {
        index: 2,
      };

      expect(onUnmountMock).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(onUnmountMock.mock.calls[0][1]).toEqual(initialUIStateFixture);
      expect(onUnmountMock.mock.calls[0][2])
        .toEqual({ ...componentStatePropsFixture, ...componentDispatchPropsFixture });

      onUnmountMock.mock.calls[0][0].setUIState(uiState);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1]).toEqual([setUIState<UIState>({ id: componentId, state: uiState })]);
    });

    it('should call onUnmount on unmount - replaceUIState', () => {
      const { wrapper, dispatch, onUnmountMock } = getSpecificWrapper();
      const uiState: UIState = {
        index: 2,
        isActive: false,
      };

      expect(onUnmountMock).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(onUnmountMock.mock.calls[0][1]).toEqual(initialUIStateFixture);
      expect(onUnmountMock.mock.calls[0][2])
        .toEqual({ ...componentStatePropsFixture, ...componentDispatchPropsFixture });

      onUnmountMock.mock.calls[0][0].replaceUIState(uiState);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1]).toEqual([replaceUIState<UIState>({ id: componentId, state: uiState })]);
    });

    it('should call onUnmount on unmount - resetUIState', () => {
      const { wrapper, dispatch, onUnmountMock } = getSpecificWrapper();

      expect(onUnmountMock).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(onUnmountMock.mock.calls[0][1]).toEqual(initialUIStateFixture);
      expect(onUnmountMock.mock.calls[0][2])
        .toEqual({ ...componentStatePropsFixture, ...componentDispatchPropsFixture });

      onUnmountMock.mock.calls[0][0].resetUIState();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1])
        .toEqual([replaceUIState<UIState>({ id: componentId, state: wrapperFixtureStateValues })]);
    });

    it('should call onUnmount on unmount - destroyUIState', () => {
      const { wrapper, dispatch, onUnmountMock } = getSpecificWrapper();

      expect(onUnmountMock).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(onUnmountMock.mock.calls[0][1]).toEqual(initialUIStateFixture);
      expect(onUnmountMock.mock.calls[0][2])
        .toEqual({ ...componentStatePropsFixture, ...componentDispatchPropsFixture });

      onUnmountMock.mock.calls[0][0].destroyUIState();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1])
        .toEqual([destroyUIState({ id: componentId })]);
    });
  };

  describe('static config', () => {

    runGlobalTests(() => getWrapper(wrapperFixture.staticIdFixture, wrapperFixture.staticUIState));

    it('should dispatch setUIState action on mount with correct values', () => {
      const { dispatch } = getWrapper(wrapperFixture.staticIdFixture, wrapperFixture.staticUIState);

      expect(dispatch).toHaveBeenCalledTimes(1);
      const action: Action = setUIState({
        id: componentId,
        state: wrapperFixture.staticUIState,
      });

      expect(dispatch).toHaveBeenCalledWith(action);
    });

  });

  describe('dynamic config', () => {

    runGlobalTests(() => getWrapper(wrapperFixture.dynamicIdFixture, wrapperFixture.dynamicUIState));

    it('should dispatch setUIState action on mount with correct id and state', () => {
      const { dispatch } = getWrapper(wrapperFixture.dynamicIdFixture, wrapperFixture.dynamicUIState);

      expect(dispatch).toHaveBeenCalledTimes(1);
      const action: Action = setUIState({
        id: componentId,
        state: wrapperFixtureStateValues,
      });

      expect(dispatch).toHaveBeenCalledWith(action);
    });

    it('should pass existingState argument to initialState function', () => {
      const config: AddReduxUIStateConfig<UIState, CustomStateProps> = {
        id: componentId,
        initialState: jest.fn(),
      };
      const Component = addReduxUIState<UIState, CustomStateProps & CustomDispatchProps>(config)(TestComponent);
      mount(<Component {...getPropsFixture()} />);

      expect(config.initialState)
        .toBeCalledWith((expect as any).anything(), initialUIStateFixture); // tslint:disable-line:no-any
    });

  });

});
