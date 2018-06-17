import { combineReducers } from 'redux';
import { DEFAULT_BRANCH_NAME, createReducer } from 'redux-ui-state';
import {
  renderPropUnmapped,
  renderPropMapped,
  utilTransformedStatic,
  utilTransformedDynamic1,
  utilTransformedDynamic2,
  utilRawStatic,
  utilRawDynamic1,
  utilRawDynamic2,
  manualTransformedStatic,
  manualTransformedDynamic1,
  manualTransformedDynamic2,
  manualRawStatic,
  manualRawDynamic1,
  manualRawDynamic2,
} from '../uiState';

export default combineReducers({
  [DEFAULT_BRANCH_NAME]: createReducer({
    [renderPropUnmapped.key]: renderPropUnmapped.value,
    [renderPropMapped.key]: renderPropMapped.value,
    [utilTransformedStatic.key]: utilTransformedStatic.value,
    [utilTransformedDynamic1.key]: utilTransformedDynamic1.value,
    [utilTransformedDynamic2.key]: utilTransformedDynamic2.value,
    [utilRawStatic.key]: utilRawStatic.value,
    [utilRawDynamic1.key]: utilRawDynamic1.value,
    [utilRawDynamic2.key]: utilRawDynamic2.value,
    [manualTransformedStatic.key]: manualTransformedStatic.value,
    [manualTransformedDynamic1.key]: manualTransformedDynamic1.value,
    [manualTransformedDynamic2.key]: manualTransformedDynamic2.value,
    [manualRawStatic.key]: manualRawStatic.value,
    [manualRawDynamic1.key]: manualRawDynamic1.value,
    [manualRawDynamic2.key]: manualRawDynamic2.value,
  }),
});
