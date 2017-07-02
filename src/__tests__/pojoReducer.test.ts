import { createReducer  } from '../pojoReducer';
import { setUIState, replaceUIState, SET_UI_STATE } from '../actions';
import { UIStateBranch } from '../utils';

const COMPONENT_ID = 'thing';

interface ComponentUIStateOptional {
  readonly isOpen?: boolean;
  readonly selectedIndex?: number;
}

interface ComponentUIStateMandatory extends ComponentUIStateOptional {
  readonly isOpen: boolean;
  readonly selectedIndex: number;
}

const getItem1State = (): ComponentUIStateOptional => ({
  isOpen: true,
  selectedIndex: 0,
});

const getItem2State = (): ComponentUIStateOptional => ({
  isOpen: false,
  selectedIndex: 666,
});

const ITEM_1_ID = 'item1';
const ITEM_2_ID = 'item2';

const getInitialState = () => ({
  [ITEM_1_ID]: getItem1State(),
  [ITEM_2_ID]: getItem2State(),
});

const getWrappedInitialState = (state: {} = getInitialState()) => ({
  components: state,
});

const createTestableReducer = () => createReducer(getInitialState());

describe('reducer', () => {

  describe('initial state', () => {

    it('contain the correct populated initial state', () => {
      const reducer = createTestableReducer();
      const actual = reducer(undefined as any, { type: 'NOT_AN_ACTION' } as any); // tslint:disable-line:no-any
      const expected = getWrappedInitialState();

      expect(actual).toEqual(expected);
    });

    it('contain the correct undefined initial state', () => {
      const reducer = createReducer(undefined as any); // tslint:disable-line:no-any
      const actual = reducer(undefined as any, { type: 'NOT_AN_ACTION' } as any); // tslint:disable-line:no-any
      const expected = {};

      expect(actual).toEqual(expected);
    });
  });

  describe('SET_UI_STATE', () => {
    it('set a new primitive value in empty initial state', () => {
      const action = setUIState<ComponentUIStateOptional>({
        state: {
          isOpen: false,
        },
        id: ITEM_1_ID,
      });
      const initialState = {
        components: {}
      };
      const actual = createReducer(initialState)(initialState, action);
      const expected = {
        components: {
          [ITEM_1_ID]: {
            isOpen: action.payload.state.isOpen
          }
        }
      };
      expect(actual).toEqual(expected);
    });

    it('set a new primitive value in populated initial state', () => {
      const action = setUIState<ComponentUIStateOptional>({
        state: {
          isOpen: false,
        },
        id: ITEM_1_ID,
      });
      const actual = createReducer(getInitialState())(getWrappedInitialState(), action);
      const expected = getWrappedInitialState();
      expected.components[ITEM_1_ID].isOpen = false;
      expect(actual).toEqual(expected);
    });

  });

  describe('REPLACE_UI_STATE', () => {
    it('set a new primitive value in empty initial state', () => {
      const action = replaceUIState<ComponentUIStateMandatory>({
        state: {
          isOpen: false,
          selectedIndex: 1,
        },
        id: ITEM_1_ID,
      });
      const initialState = {
        components: {}
      };
      const actual = createReducer({})(initialState, action);
      const expected = {
        components: {
          [ITEM_1_ID]: action.payload.state
        }
      };
      expect(actual).toEqual(expected);
    });

    it('set a new primitive value in populated initial state', () => {
      const action = replaceUIState<ComponentUIStateMandatory>({
        state: {
          isOpen: false,
          selectedIndex: 1,
        },
        id: ITEM_1_ID,
      });

      const actual = createReducer(getInitialState())(getWrappedInitialState(), action);
      const expected = {
        ...getWrappedInitialState(),
        components: {
          ...getInitialState(),
          [ITEM_1_ID]: action.payload.state
        }
      };
      expect(actual).toEqual(expected);
    });

  });

});
