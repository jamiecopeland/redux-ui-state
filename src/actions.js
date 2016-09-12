export const SET_UI_STATE = 'uiActions.SET_UI_STATE';
export const REPLACE_UI_STATE = 'uiActions.REPLACE_UI_STATE';

export const setUIState = ({ state, shouldDeepMerge = false, id }) => ({
  type: SET_UI_STATE,
  payload: { state, shouldDeepMerge, id },
});

export const replaceUIState = ({ state, id }) => ({
  type: REPLACE_UI_STATE,
  payload: { state, id },
});
