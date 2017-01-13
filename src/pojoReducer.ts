import { SET_UI_STATE, REPLACE_UI_STATE, ModifyUIStateAction, DestroyUIStateAction, DESTROY_UI_STATE } from './actions';
import { merge } from './utils';
import { UIStateBranch } from './addReduxUIState';

export const initialState: UIStateBranch = {
  components: {},
};

export const reducer = (
  state = initialState,
  action: ModifyUIStateAction<Object> | DestroyUIStateAction
) => {
  switch (action.type) {
    case SET_UI_STATE: {
      return merge(
        state,
        {
          components: merge(
            state.components,
            {
              [action.payload.id]: merge(
                state.components[action.payload.id],
                (action as ModifyUIStateAction<Object>).payload.state
              ),
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
            [action.payload.id]: (action as ModifyUIStateAction<Object>).payload.state,
          }
        }
      );
    }

    case DESTROY_UI_STATE: {
      const newComponentsObj = {...state.components};
      delete newComponentsObj[action.payload.id];
      return {
        components: newComponentsObj
      };
    }

    default: {
      return state;
    }
  }
};
