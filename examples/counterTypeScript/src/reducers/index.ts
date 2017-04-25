import { pojoReducer, DEFAULT_BRANCH_NAME, DefaultStateShape, ActionUnion } from 'redux-ui-state';

export default (state?: DefaultStateShape, action?: ActionUnion): DefaultStateShape => ({
  // TODO Look into making uiState key a variable and not anger tsc
  uiState: pojoReducer(state ? state[DEFAULT_BRANCH_NAME] : undefined, action),
});
