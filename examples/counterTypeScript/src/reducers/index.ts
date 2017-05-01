import { combineReducers } from 'redux';
import { reducer, DEFAULT_BRANCH_NAME } from 'redux-ui-state';
import { AppState } from '../state/index';

export default combineReducers<AppState>({
  [DEFAULT_BRANCH_NAME]: reducer
});
