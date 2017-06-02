import { SET_UI_STATE, REPLACE_UI_STATE, ModifyUIStateAction } from './actions';
import { UIStateBranch } from './utils';

/**
 * Makes all your dreams (or at least your actions) come true.
 */
export const createReducer = <TInitialState = Record<string, any>>( // tslint:disable-line:no-any
  initialState?: TInitialState
) => (
  state: UIStateBranch = { components: initialState },
  action: ModifyUIStateAction<object>
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

    default: {
      return state;
    }
  }
};
