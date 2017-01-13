export const SET_UI_STATE = 'reduxUIState.SET_UI_STATE';
export const REPLACE_UI_STATE = 'reduxUIState.REPLACE_UI_STATE';
export const DESTROY_UI_STATE = 'reduxUIState.DESTROY_UI_STATE';

export interface ModifyUIStateActionPayload<T> {
  id: string;
  state: T;
}

export interface ModifyUIStateAction<T> {
  type: string;
  payload: ModifyUIStateActionPayload<T>;
}

export interface DestroyUIStateActionPayload {
  id: string;
}

export interface DestroyUIStateAction {
  type: string;
  payload: DestroyUIStateActionPayload;
}

export const setUIState = <T>({ id, state }: ModifyUIStateActionPayload<T>) => ({
  type: SET_UI_STATE,
  payload: { id, state },
});

export const replaceUIState = <T>({ id, state }: ModifyUIStateActionPayload<T>) => ({
  type: REPLACE_UI_STATE,
  payload: { id, state },
});

export const destroyUIState = ({ id }: DestroyUIStateActionPayload) => ({
  type: DESTROY_UI_STATE,
  payload: { id },
});
