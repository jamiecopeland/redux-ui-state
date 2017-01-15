export const SET_UI_STATE = 'reduxUIState.SET_UI_STATE';
export const REPLACE_UI_STATE = 'reduxUIState.REPLACE_UI_STATE';
export const DESTROY_UI_STATE = 'reduxUIState.DESTROY_UI_STATE';

export interface ModifyUIStateActionPayload<TUIState> {
  id: string;
  state: TUIState;
}

export interface ModifyUIStateAction<TUIState> {
  type: string;
  payload: ModifyUIStateActionPayload<TUIState>;
}

export interface DestroyUIStateActionPayload {
  id: string;
}

export interface DestroyUIStateAction {
  type: string;
  payload: DestroyUIStateActionPayload;
}

export const setUIState = <TUIState>({ id, state }: ModifyUIStateActionPayload<TUIState>) => ({
  type: SET_UI_STATE,
  payload: { id, state },
});

export const replaceUIState = <TUIState>({ id, state }: ModifyUIStateActionPayload<TUIState>) => ({
  type: REPLACE_UI_STATE,
  payload: { id, state },
});

export const destroyUIState = ({ id }: DestroyUIStateActionPayload) => ({
  type: DESTROY_UI_STATE,
  payload: { id },
});
