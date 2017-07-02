import { setUIState as setUIStateActionCreator } from '../actions';

import {
  Id,
  UIStateIdProps,
  DefaultStoreState,
  UIStateBranch,
  UIStateBranchSelectorSelectorProps,

  idIsString,
  idIsFunction,
  getStringFromId,
  stateSelector,
  propsSelector,
  defaultUIStateBranchSelector,
  uiStateBranchSelectorSelector,
  uiStateBranchSelector,
  idSelector,
  uiStateSelector,
  setUIStateSelector,
} from '../utils';

//////////////////////////////////////////////////
// Fixtures

const componentId = 'thing';

const getUIState = (): UIStateBranch => ({
  components: {
    [componentId]: {
      counter: 0,
    }
  }
});

const getDefaultAppState = (): DefaultStoreState => ({
  ui: getUIState(),
});

interface CustomStoreState {
  vendors: {
    ui: UIStateBranch;
  };
}

const getCustomAppState = (): CustomStoreState => ({
  vendors: {
    ui: getUIState(),
  }
});

const customSelector = (state: CustomStoreState) => state.vendors.ui;

const getPropsWithCustomSelector: UIStateBranchSelectorSelectorProps<CustomStoreState> = {
  uiStateBranchSelector: customSelector
};

//////////////////////////////////////////////////
// Tests

describe('utils', () => {

  describe('idIsString', () => {
    it('should return true if id is string', () => {
      expect(
        idIsString(componentId)
      ).toBe(true);
    });

    it('should return false if id is not a string', () => {
      expect(
        idIsString(() => componentId)
      ).toBe(false);
      expect(
        idIsString(({ uiStateId }) => uiStateId)
      ).toBe(false);
      expect(
        idIsString(undefined)
      ).toBe(false);
    });
  });

  describe('idIsFunction', () => {
    it('should return true if id is function', () => {
      expect(
        idIsFunction(({ uiStateId }) => uiStateId)
      ).toBe(true);
    });

    it('should return false if id is not a function', () => {
      expect(
        idIsFunction(componentId)
      ).toBe(false);
    });

    it('should return false if id is not a function', () => {
      expect(
        idIsFunction(undefined)
      ).toBe(false);
    });
  });

  describe('getStringFromId', () => {
    interface Props { uiStateId?: string; }

    const getId: Id<Props> = ({ uiStateId }) => uiStateId;
    const populatedProps: Props = { uiStateId: componentId };
    const unpopulatedProps: Props = {};

    it('should return value passed in for a string', () => {
      expect(
        getStringFromId(componentId, unpopulatedProps)
      ).toBe(componentId);

      expect(
        getStringFromId(componentId, populatedProps)
      ).toBe(componentId);
    });

    it('should return value contained in props via function', () => {
      expect(
        getStringFromId(getId, populatedProps)
      ).toBe(componentId);

      expect(
        getStringFromId(getId, unpopulatedProps)
      ).toBeUndefined();
    });
  });

  describe('stateSeletor', () => {
    it('should return props when props are present', () => {
      const state: DefaultStoreState = { ui: { components: { } } };
      expect(
        stateSelector(state)
      ).toBe(state);
    });

    it('should return undefined when props are not present', () => {
      expect(
        stateSelector(undefined)
      ).toBeUndefined();
    });
  });

  describe('propsSelector', () => {
    it('should return props when props are present', () => {
      const props = { uiStateId: componentId };
      expect(
        propsSelector(undefined, props)
      ).toBe(props);
    });

    it('should return undefined when props are not present', () => {
      expect(
        propsSelector(undefined, undefined)
      ).toBeUndefined();
    });
  });

  describe('defaultUIStateBranchSelector', () => {
    it('should select branch from populated state', () => {
      expect(
        defaultUIStateBranchSelector(getDefaultAppState())
      ).toEqual(getUIState());
    });

    it('should select undefined from unpopulated state', () => {
      expect(
        defaultUIStateBranchSelector({} as any) // tslint:disable-line:no-any
      ).toBeUndefined();
    });
  });

  describe('uiStateBranchSelectorSelector', () => {
    it('should return a selector if props are populated', () => {
      expect(
        uiStateBranchSelectorSelector({}, {
          uiStateBranchSelector: customSelector
        })
      ).toBe(customSelector);
    });

    it('should return the undefined if props are empty', () => {
      expect(
        () => uiStateBranchSelectorSelector({}, {})
      ).toThrowError();
    });
  });

  describe('defaultUIStateBranchSelector', () => {
    it('should select branch from populated default state', () => {
      expect(
        defaultUIStateBranchSelector(getDefaultAppState())
      ).toEqual(getUIState());
    });

    it('should select undefined from unpopulated state', () => {
      expect(
        defaultUIStateBranchSelector({} as any) // tslint:disable-line:no-any
      ).toBeUndefined();
    });
  });

  describe('uiStateBranchSelector', () => {
    it('should select the uiState branch if it is present', () => {
      const appState = getDefaultAppState();
      expect(
        uiStateBranchSelector.resultFunc(defaultUIStateBranchSelector, appState)
      ).toBe(appState.ui);
    });

    it('should select undefined if uiState branch is not present', () => {
      expect(
        () => uiStateBranchSelector({}, {})
      ).toThrow();
    });
  });

  describe('idSelector', () => {
    it('should select the id from the props if id is a string', () => {
      expect(
        idSelector({}, {
          uiStateId: componentId
        })
      ).toBe(componentId);
    });

    it('should select the id from the props if id is a function and correct props are present', () => {
      interface Props extends UIStateIdProps<Props> {
        customId: string;
      }
      expect(
        idSelector<Props>({}, {
          customId: componentId,
          uiStateId: ({ customId }) => customId
        })
      ).toBe(componentId);
    });

    it('should select undefined if id is a function and dynamic id props is missing', () => {
      interface Props extends UIStateIdProps<Props> {
        customId?: string;
      }
      expect(
        idSelector<Props>({}, {
          uiStateId: ({ customId }) => customId
        })
      ).toBeUndefined();
    });

  });

  describe('uiStateSelector', () => {
    it('should return the UI state for an identified component if present', () => {
      const appState = getDefaultAppState();
      expect(
        uiStateSelector.resultFunc(appState.ui.components, componentId)
      ).toBe(appState.ui.components[componentId]);
    });

    it('should return undefined if value is not present', () => {
      const appState = getDefaultAppState();
      expect(
        uiStateSelector.resultFunc(appState.ui.components, 'notThing')
      ).toBeUndefined();
    });
  });

  describe('setUIStateSelector', () => {
    interface UIState {
      index: number;
      otherValue?: string;
    }

    const createWrapper = () => {
      const dispatch = jest.fn();
      const setUIState = setUIStateSelector<UIState, UIStateIdProps<{}>>(dispatch, { uiStateId: componentId });
      return { dispatch, setUIState };
    };

    it('should return the setUIState function', () => {
      const { dispatch, setUIState } = createWrapper();
      const newState: UIState = { index: 13 };
      setUIState(newState);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(setUIStateActionCreator({
        id: componentId,
        state: newState
      }));
    });

    it('should throw an error if uiStateId is undefined', () => {
      expect(() => setUIStateSelector<UIState, UIStateIdProps<{}>>(jest.fn(), { uiStateId: () => undefined }))
        .toThrow();
    });
  });

});
