import { SET_UI_STATE, REPLACE_UI_STATE } from './actions';
import { merge } from './utils'

export const initialState = {
  components: {},
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UI_STATE: {
      return merge(
        state,
        {
          components: merge(
            state.components,
            {
              [action.payload.id]: merge(state.components[action.payload.id], action.payload.state),
            }
          )
        }
      );
    }

    case REPLACE_UI_STATE: {
      return merge(
        state,
        {
          components: {
            [action.payload.id]: action.payload.state,
          }
        }
      );
    }

    default: {
      return state;
    }
  }
};
