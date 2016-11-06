export const SET_UI_STATE = 'reduxUIState.SET_UI_STATE';
export const REPLACE_UI_STATE = 'reduxUIState.REPLACE_UI_STATE';

export const setUIState = ({ state, id }) => ({
  type: SET_UI_STATE,
  payload: { state, id },
});

export const replaceUIState = ({ state, id }) => ({
  type: REPLACE_UI_STATE,
  payload: { state, id },
});
