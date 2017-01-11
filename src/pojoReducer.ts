import { SET_UI_STATE, REPLACE_UI_STATE, ReduxUIAction } from './actions';
import { merge } from './utils';
import { UIStateBranch } from './addReduxUIState';

export const initialState: UIStateBranch = {
  components: {},
};

export const reducer = (state = initialState, action: ReduxUIAction<Object>) => {
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
