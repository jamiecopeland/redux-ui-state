export const SET_UI_STATE = '@@redux-ui-state/SET_UI_STATE';
export const REPLACE_UI_STATE = '@@redux-ui-state/REPLACE_UI_STATE';

export interface ModifyUIStateActionPayload<TUIState> {
  id: string;
  state: TUIState;
}

export interface ModifyUIStateAction<TUIState> {
  type: string;
  payload: ModifyUIStateActionPayload<TUIState>;
}

export const setUIState = <TUIState>({ id, state }: ModifyUIStateActionPayload<Partial<TUIState>>) => ({
  type: SET_UI_STATE,
  payload: { id, state },
});

export const replaceUIState = <TUIState>({ id, state }: ModifyUIStateActionPayload<TUIState>) => ({
  type: REPLACE_UI_STATE,
  payload: { id, state },
});
