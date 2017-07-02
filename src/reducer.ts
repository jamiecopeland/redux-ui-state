import { SET_UI_STATE, REPLACE_UI_STATE, ModifyUIStateAction } from './actions';
import { UIStateBranch } from './utils';

/**
 * Makes all your dreams (or at least your actions) come true.
 */
export const createReducer = ( // tslint:disable-line:no-any
  initialState: UIStateBranch
) => (
  state: UIStateBranch = initialState,
  action: ModifyUIStateAction<object>
) => {
  switch (action.type) {
    case SET_UI_STATE: {
      return ({
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...(action as ModifyUIStateAction<object>).payload.state
        },
      });
    }

    case REPLACE_UI_STATE: {
      return {
        ...state,
        [action.payload.id]: (action as ModifyUIStateAction<object>).payload.state,
      };
    }

    default: {
      return state;
    }
  }
};
