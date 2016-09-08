import { reduxUIStateReducer, UI_STATE_BRANCH_NAME } from 'redux-ui-state';

export default (state, action) => ({
  [UI_STATE_BRANCH_NAME]: reduxUIStateReducer(
    state[UI_STATE_BRANCH_NAME], action
  ),
});
