import { SET_UI_STATE, REPLACE_UI_STATE, ModifyUIStateAction, DestroyUIStateAction, DESTROY_UI_STATE } from './actions';
import { UIStateBranch } from './addReduxUIState';

export const initialState: UIStateBranch = {
  components: {},
};

export type ActionUnion = ModifyUIStateAction<object> | DestroyUIStateAction;

/**
 * Makes all your dreams (or at least actions) come true.
 */
export const reducer = (
  state = initialState,
  action: ActionUnion
) => {
  switch (action.type) {
    case SET_UI_STATE: {
      return ({
        ...state,
        components: {
          ...state.components,
          [action.payload.id]: {
            ...state.components[action.payload.id],
            ...(action as ModifyUIStateAction<object>).payload.state
          },
        }
      });
    }

    case REPLACE_UI_STATE: {
      return {
        ...state,
        components: {
          ...state.components,
          [action.payload.id]: (action as ModifyUIStateAction<object>).payload.state,
        }
      };
    }

    case DESTROY_UI_STATE: {
      const newComponentsObj = {...state.components};
      delete newComponentsObj[action.payload.id];
      return {
        ...state,
        components: newComponentsObj
      };
    }

    default: {
      return state;
    }
  }
};
