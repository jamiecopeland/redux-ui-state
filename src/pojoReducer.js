import merge from 'lodash.merge';
import { SET_UI_STATE, REPLACE_UI_STATE } from './actions';

export const initialState = {
  components: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_UI_STATE: {
      return {
        ...state,
        components: {
          ...state.components,
          [action.payload.id]: action.payload.shouldDeepMerge
            ? merge({}, state.components[action.payload.id], action.payload.state)
            : { ...state.components[action.payload.id], ...action.payload.state },
        },
      };
    }

    case REPLACE_UI_STATE: {
      return {
        ...state,
        components: {
          [action.payload.id]: action.payload.state,
        },
      };
    }

    default: {
      return state;
    }
  }
};
