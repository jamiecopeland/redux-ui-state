import { reducer, initialState as defaultInitialState } from '../reducer';
import { setUIState, replaceUIState, destroyUIState } from '../actions';
import { UIStateBranch } from '../addReduxUIState';

const COMPONENT_ID = 'thing';

interface ComponentUIState {
  readonly isOpen?: boolean;
  readonly selectedIndex?: number;
}

const getUser = (): ComponentUIState => ({
  isOpen: true,
  selectedIndex: 0,
});

const createState = (
  state: ComponentUIState, componentId: string = COMPONENT_ID
): UIStateBranch => ({
    components: {
      [componentId]: state,
    },
  });

describe('reducer', () => {

  describe('SET_UI_STATE', () => {
    it('set a new primitive value in empty initial state', () => {
      const action = setUIState<ComponentUIState>({
        state: {
          isOpen: getUser().isOpen,
        },
        id: COMPONENT_ID,
      });
      const newState = reducer(defaultInitialState, action);

      expect(newState).toEqual(createState({
        isOpen: getUser().isOpen,
      }));
    });

    it('set a new primitive value in populated initial state', () => {
      const initialState: UIStateBranch = createState({
        selectedIndex: getUser().selectedIndex,
      });
      const action = setUIState<ComponentUIState>({
        state: {
          isOpen: getUser().isOpen,
        },
        id: COMPONENT_ID,
      });
      const newState = reducer(initialState, action);
      expect(newState).toEqual(createState({
        isOpen: getUser().isOpen,
        selectedIndex: getUser().selectedIndex,
      }));
    });

    it('set the value of a pre-existing property', () => {
      const initialIndex = 0;
      const newIndex = 1;

      const initialState: UIStateBranch = createState({
        selectedIndex: initialIndex,
      });
      const action = setUIState<ComponentUIState>({
        state: {
          selectedIndex: newIndex,
        },
        id: COMPONENT_ID,
      });
      const newState = reducer(initialState, action);
      expect(newState).toEqual(createState({
        selectedIndex: newIndex,
      }));
    });
  });

  describe('REPLACE_UI_STATE', () => {
    it('should replace ui state with empty state', () => {
      const initialState: UIStateBranch = createState({});

      const replacementState: ComponentUIState = {
        selectedIndex: getUser().selectedIndex,
      };

      const action = replaceUIState({
        id: COMPONENT_ID,
        state: replacementState,
      });

      const newState = reducer(initialState, action);
      expect(newState).toEqual(createState(replacementState));
    });

    it('should replace ui state with populated state', () => {
      const initialState: UIStateBranch = createState({
        isOpen: getUser().isOpen,
      });

      const replacementState: ComponentUIState = {
        selectedIndex: getUser().selectedIndex,
      };

      const action = replaceUIState<ComponentUIState>({
        id: COMPONENT_ID,
        state: replacementState,
      });

      const newState = reducer(initialState, action);
      expect(newState).toEqual(createState(replacementState));
    });
  });

  describe('DESTROY_UI_STATE', () => {
    it('should destroy ui state', () => {
      const initialState: UIStateBranch = createState({
        isOpen: getUser().isOpen,
      });

      const action = destroyUIState({
        id: COMPONENT_ID,
      });

      const newState = reducer(initialState, action);

      expect(newState).toEqual({
        components: {}
      });
    });
  });
});
