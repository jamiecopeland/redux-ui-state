import { reduxUIStateReducer, DEFAULT_BRANCH_NAME } from 'redux-ui-state';

export default (state = {}, action) => ({
  [DEFAULT_BRANCH_NAME as string]: reduxUIStateReducer(state[DEFAULT_BRANCH_NAME], action),
});
