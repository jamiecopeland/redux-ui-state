export const SET_UI_STATE = 'uiActions.SET_UI_STATE';
export const RESET_STATE = 'uiActions.RESET_UI_STATE';

export const setUIState = ({ state, shouldDeepMerge, id }) => ({
  type: SET_UI_STATE,
  payload: { state, shouldDeepMerge, id },
});
