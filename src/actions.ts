export const SET_UI_STATE = 'reduxUIState.SET_UI_STATE';
export const REPLACE_UI_STATE = 'reduxUIState.REPLACE_UI_STATE';

export interface ReduxUIActionPayload<T> {
  id: string;
  state: T;
}

export interface ReduxUIAction<T> {
  type: string;
  payload: ReduxUIActionPayload<T>;
}

export const setUIState = <T>({ id, state }: ReduxUIActionPayload<T>) => ({
  type: SET_UI_STATE,
  payload: { id, state },
});

export const replaceUIState = <T>({ id, state }: ReduxUIActionPayload<T>) => ({
  type: REPLACE_UI_STATE,
  payload: { id, state },
});
