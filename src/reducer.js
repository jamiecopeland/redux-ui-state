import merge from 'lodash.merge';
import { SET_UI_STATE } from './actions';

export const reduxUIStateReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_UI_STATE: {
      return {
        ...state,
        [action.payload.id]: action.payload.shouldDeepMerge
          ? merge({}, state[action.payload.id], action.payload.state)
          : { ...state[action.payload.id], ...action.payload.state },
      };
    }

    default: {
      return state;
    }
  }
};
