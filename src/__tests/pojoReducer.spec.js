import { expect } from 'chai';

import pojoReducer, { initialState as defaultInitialState } from '../pojoReducer';
import { setUIState } from '../actions';

const COMPONENT_ID = 'thing';

describe('pojoReducer', () => {
  let testStrings;

  beforeEach(() => {
    testStrings = {
      person: {
        firstName: 'Darth',
        lastName: 'Vader',
      },
    };
  });

  describe('SET_UI_STATE', () => {
    it('set a new primitive value in empty initial state', () => {
      const action = setUIState({
        state: {
          firstName: testStrings.person.firstName,
        },
        shouldDeepMerge: false,
        id: COMPONENT_ID,
      });
      const newState = pojoReducer(defaultInitialState, action);

      expect(newState).to.deep.equal({
        components: {
          thing: {
            firstName: testStrings.person.firstName,
          },
        },
      });
    });

    it('set a new primitive value in populated initial state', () => {
      const initialState = {
        components: {
          [COMPONENT_ID]: {
            lastName: testStrings.person.lastName,
          },
        },
      };
      const action = setUIState({
        state: {
          firstName: testStrings.person.firstName,
        },
        shouldDeepMerge: false,
        id: COMPONENT_ID,
      });
      const newState = pojoReducer(initialState, action);
      expect(newState).to.deep.equal({
        components: {
          thing: {
            firstName: testStrings.person.firstName,
            lastName: testStrings.person.lastName,
          },
        },
      });
    });
  });
});
