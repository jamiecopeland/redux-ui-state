import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Action, Dispatch } from 'redux';
import { StatelessComponent } from 'react';

import {
  Props as ReduxUIStateProps,
  addReduxUIState,
  ExportedComponentDispatchProps,
  ExportedComponentStateProps,
  UIStateBranch,
  setUIState, replaceUIState,
  Id,
  DefaultStateShape,
  DispatchProps,
  TransformPropsFunction,
} from '../index';

// Component props

interface UIState {
  index: number;
  isActive: boolean;
}

interface ComponentStateProps {
  indexPrefix: string;
  dynamicId?: string;
}

interface ComponentDispatchProps {
  onSomethingUnrelated: () => void;
}

type ComponentProps = ComponentStateProps & ComponentDispatchProps;

// Fixtures

const defaultId = 'thing';
const dynamicId = 'dynamicThing';

const initialUIStateFixture: UIState = {
  index: 0,
  isActive: false,
};

const componentStatePropsFixture: ComponentStateProps = {
  indexPrefix: 'Value: ',
  dynamicId: 'dynamicThing',
};

const componentDispatchPropsFixture: ComponentDispatchProps = {
  onSomethingUnrelated: () => undefined,
};

const reduxStateBranchFixture: UIStateBranch = {
  components: {
    [defaultId]: initialUIStateFixture,
    [dynamicId]: initialUIStateFixture,
  }
};

type AllProps = ExportedComponentStateProps & ExportedComponentDispatchProps & ComponentProps;

const getPropsFixture = (dispatch = jest.fn()): AllProps => ({
  ...componentStatePropsFixture,
  ...componentDispatchPropsFixture,
  uiStateBranch: reduxStateBranchFixture,
  dispatch: jest.fn(),
});

// Component fixture

const RawPropsComponent: StatelessComponent<ComponentProps & ReduxUIStateProps<UIState>> = (
  { uiState, setUIState, replaceUIState, indexPrefix }
) => (
  <div id="root">
    <span id="indexLabel">{indexPrefix} {uiState.index}</span>
    <button id="setUIStateButton" onClick={() => setUIState({ index: uiState.index + 1 })}>
      setState
    </button>
    <button id="replaceUIStateButton" onClick={() => replaceUIState({ index: uiState.index + 1, isActive: true })}>
      replaceState
    </button>
  </div>
);

interface TransformedComponentProps {
  index: number;
  increment: () => void;
  toggleActive: () => void;
}

const transformFunctionImplementation: TransformPropsFunction<UIState, ComponentProps, TransformedComponentProps> = (
  uiState: UIState,
  dispatchProps: DispatchProps<UIState>,
  ownProps: ComponentProps,
) => ({
  index: uiState.index,
  increment: () => dispatchProps.setUIState({ index: uiState.index + 1 }),
  toggleActive: () => dispatchProps.setUIState({ isActive: !uiState.isActive }),
});

const TransformedPropsComponent: StatelessComponent<ComponentProps & TransformedComponentProps> = (
  { index, increment, toggleActive }
) => (
  <div id="root">
    <span id="indexLabel">{index}</span>
    <button id="incrementButton" onClick={increment}>
      Increment
    </button>
    <button id="toggleActiveButton" onClick={toggleActive}>
      Toggle active
    </button>
  </div>
);

// const wrapperFixture = {
//   staticIdFixture: defaultId,
//   dynamicIdFixture: ({ dynamicId = defaultId }: ComponentStateProps) => dynamicId,
// };

interface GetWrapperOutput {
  dispatch: jest.Mock<Action>;
  wrapper: ReactWrapper<ComponentStateProps & ComponentDispatchProps, void>;
}

const getRawPropsWrapper = (
  id: Id<ComponentStateProps>,
): GetWrapperOutput => {
  const Component = addReduxUIState<UIState, ComponentStateProps & ComponentDispatchProps>(id)(RawPropsComponent);
  const props = getPropsFixture();

  return {
    wrapper: mount(<Component {...props} />),
    dispatch: props.dispatch as jest.Mock<Action>,
  };
};

const getTransformPropsWrapper = (
  id: Id<ComponentStateProps>,
  // transformFunction: TransformPropsFunc<UIState, ComponentProps, TransformedComponentProps>
) => {
  const transformFunction = jest.fn();
  const Component = addReduxUIState<UIState, ComponentProps, TransformedComponentProps>(
    id, transformFunction
  )(TransformedPropsComponent);
  const props = getPropsFixture();

  return {
    wrapper: mount(<Component {...props} />),
    dispatch: props.dispatch as jest.Mock<Action>,
    transformFunction,
  };
};

describe('addReduxUIState', () => {

  const runGlobalTests = (getSpecificWrapper: () => GetWrapperOutput) => {

    it('should recieve proxied props', () => {
      const { wrapper } = getSpecificWrapper();
      expect((wrapper.first().props()).indexPrefix)
        .toEqual(componentStatePropsFixture.indexPrefix);
      expect((wrapper.first().props()).onSomethingUnrelated)
        .toEqual(componentDispatchPropsFixture.onSomethingUnrelated);
    });

  };

  describe('Raw props implementation', () => {

    runGlobalTests(() => getRawPropsWrapper(defaultId));
    runGlobalTests(() => getRawPropsWrapper((props) => props.dynamicId));

    it('should recieve correct uiState prop with static id', () => {
      const { wrapper } = getRawPropsWrapper(defaultId);
      expect(((wrapper.find(RawPropsComponent).props())).uiState).toEqual(initialUIStateFixture);
    });

    it('should recieve correct uiState prop with dynamic id', () => {
      const { wrapper } = getRawPropsWrapper((props) => props.dynamicId);
      expect(((wrapper.find(RawPropsComponent).props())).uiState).toEqual(initialUIStateFixture);
    });

    it('should dispatch setUIState action when setUIState prop is called', () => {
      const { wrapper, dispatch } = getRawPropsWrapper(defaultId);

      wrapper.find(RawPropsComponent).props().setUIState({
        index: initialUIStateFixture.index + 1,
      });

      const action: Action = setUIState({
        id: defaultId,
        state: {
          index: initialUIStateFixture.index + 1,
        }
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(action);
    });

    it('should dispatch replaceUIState action when replaceUIState prop is called', () => {
      const { wrapper, dispatch } = getRawPropsWrapper(defaultId);

      const newState = {
        index: initialUIStateFixture.index + 1,
        isActive: true,
      };
      wrapper.find(RawPropsComponent).props().replaceUIState(newState);

      const action: Action = replaceUIState({
        id: defaultId,
        state: newState,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(action);
    });

  });

  describe('Transform props implementation', () => {

    runGlobalTests(() => getTransformPropsWrapper(defaultId));
    runGlobalTests(() => getTransformPropsWrapper((props) => props.dynamicId));

    it('should call transformFunction once', () => {
      const { transformFunction } = getTransformPropsWrapper(defaultId);

      expect(transformFunction).toHaveBeenCalledTimes(1);
    });

    it('should call transformFunction with correct uiState argument', () => {
      const { transformFunction } = getTransformPropsWrapper(defaultId);

      expect(transformFunction.mock.calls[0][0]).toEqual(initialUIStateFixture);
    });

    it('should call transformFunction with correct setUIState argument', () => {
      const { transformFunction, dispatch } = getTransformPropsWrapper(defaultId);

      transformFunction.mock.calls[0][1].setUIState({
        index: initialUIStateFixture.index + 1,
      });

      const action: Action = setUIState({
        id: defaultId,
        state: {
          index: initialUIStateFixture.index + 1,
        }
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(action);
    });

    it('should call transformFunction with correct replaceUIState argument', () => {
      const { transformFunction, dispatch } = getTransformPropsWrapper(defaultId);

      const newState = {
        index: initialUIStateFixture.index + 1,
        isActive: true,
      };
      transformFunction.mock.calls[0][1].replaceUIState(newState);

      const action: Action = replaceUIState({
        id: defaultId,
        state: newState
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(action);
    });

    it('should pass through outer props', () => {
      const { transformFunction, dispatch } = getTransformPropsWrapper(defaultId);

      expect(transformFunction.mock.calls[0][2])
        .toEqual({
          ...componentStatePropsFixture,
          ...componentDispatchPropsFixture,
          dispatch,
        });
    });

  });

});
