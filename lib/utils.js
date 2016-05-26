'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultUiBranchAccessor = defaultUiBranchAccessor;
exports.mapProps = mapProps;

var _constants = require('./constants');

function defaultUiBranchAccessor(state) {
  return state[_constants.DEFAULT_BRANCH_NAME];
}

function mapProps(_ref) {
  var uiState = _ref.uiState;
  var setUIState = _ref.setUIState;
  var resetUIState = _ref.resetUIState;

  return { uiState: uiState, setUIState: setUIState, resetUIState: resetUIState };
}