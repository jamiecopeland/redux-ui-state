import { combineReducers } from 'redux';
import { DEFAULT_BRANCH_NAME, defaultBranchSelector, createReducer } from 'redux-ui-state';

const initialState = {
  counterStatic: { index: 0 },
  counterDynamicId1: { index: 0 },
  counterDynamicId2: { index: 0 },
  counterTransformed: { index: 0 },
  counterUtil: { index: 0 },
  counterManual: { index: 0 },
};

export default combineReducers({
  [DEFAULT_BRANCH_NAME]: createReducer(initialState)
});
