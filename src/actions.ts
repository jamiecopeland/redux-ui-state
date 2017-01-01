export const SET_UI_STATE = 'reduxUIState.SET_UI_STATE';
export const REPLACE_UI_STATE = 'reduxUIState.REPLACE_UI_STATE';

export const setUIState = ({ id, state }) => ({
  type: SET_UI_STATE,
  payload: { id, state },
});

export const replaceUIState = ({ id, state }) => ({
  type: REPLACE_UI_STATE,
  payload: { id, state },
});
