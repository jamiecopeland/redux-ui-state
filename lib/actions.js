'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SET_UI_STATE = exports.SET_UI_STATE = 'uiActions.SET_UI_STATE';
var RESET_STATE = exports.RESET_STATE = 'uiActions.RESET_UI_STATE';

var setUIState = exports.setUIState = function setUIState(_ref) {
  var state = _ref.state;
  var shouldDeepMerge = _ref.shouldDeepMerge;
  var id = _ref.id;
  return {
    type: SET_UI_STATE,
    payload: { state: state, shouldDeepMerge: shouldDeepMerge, id: id }
  };
};