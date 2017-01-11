import { reducer, initialState as defaultInitialState } from '../pojoReducer';
import { setUIState, replaceUIState } from '../actions';
import { UIStateBranch } from '../addReduxUIState';

const COMPONENT_ID = 'thing';

interface ComponentUIState {
  readonly firstName?: string;
  readonly lastName?: string;
}

const getUser = (): ComponentUIState => ({
  firstName: 'Darth',
  lastName: 'Vader',
});

describe('pojoReducer', () => {

  describe('SET_UI_STATE', () => {
    it('set a new primitive value in empty initial state', () => {
      const action = setUIState<ComponentUIState>({
        state: {
          firstName: getUser().firstName,
        },
        id: COMPONENT_ID,
      });
      const newState = reducer(defaultInitialState, action);

      expect(newState).toEqual({
        components: {
          [COMPONENT_ID]: {
            firstName: getUser().firstName,
          },
        },
      });
    });

    it('set a new primitive value in populated initial state', () => {
      const initialState: UIStateBranch = {
        components: {
          [COMPONENT_ID]: {
            lastName: getUser().lastName,
          },
        },
      };
      const action = setUIState<ComponentUIState>({
        state: {
          firstName: getUser().firstName,
        },
        id: COMPONENT_ID,
      });
      const newState = reducer(initialState, action);
      expect(newState).toEqual({
        components: {
          [COMPONENT_ID]: {
            firstName: getUser().firstName,
            lastName: getUser().lastName,
          },
        },
      });
    });
  });

  describe('REPLACE_UI_STATE', () => {
    it('should replace ui state with empty state', () => {
      const initialState: UIStateBranch = {
        components: {
          [COMPONENT_ID]: {
            firstName: getUser().firstName,
          },
        },
      };

      const replacementState: ComponentUIState = {
        lastName: getUser().lastName,
      };

      const action = replaceUIState({
        id: COMPONENT_ID,
        state: replacementState,
      });

      const newState = reducer(initialState, action);
      expect(newState).toEqual({
        components: {
          [COMPONENT_ID]: replacementState,
        },
      });
    });

    it('should replace ui state with populated state', () => {
      const initialState: UIStateBranch = {
        components: {
          [COMPONENT_ID]: {
            firstName: getUser().firstName,
          },
        },
      };

      const replacementState: ComponentUIState = {
        lastName: getUser().lastName,
      };

      const action = replaceUIState<ComponentUIState>({
        id: COMPONENT_ID,
        state: replacementState,
      });

      const newState = reducer(initialState, action);
      expect(newState).toEqual({
        components: {
          [COMPONENT_ID]: replacementState,
        },
      });
    });
  });
});
