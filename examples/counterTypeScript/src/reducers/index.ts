import { combineReducers } from 'redux';
import { DEFAULT_BRANCH_NAME, defaultBranchSelector, createReducer } from 'redux-ui-state';

export default combineReducers({
  [DEFAULT_BRANCH_NAME]: createReducer({
    counterRawStatic: { index: 0 },
    counterTransformedStatic: { index: 0 },
    counterDynamicId1: { index: 0 },
    counterDynamicId2: { index: 0 },
    counterDynamicId3: { index: 0 },
    counterDynamicId4: { index: 0 },
    counterManualStaticId: { index: 0 },
    counterManualDynamicId1: { index: 0 },
    counterManualDynamicId2: { index: 0 },
  }),
});
