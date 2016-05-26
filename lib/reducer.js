'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxUIStateReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reduxUIStateReducer = exports.reduxUIStateReducer = function reduxUIStateReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.SET_UI_STATE:
      {
        return _extends({}, state, _defineProperty({}, action.payload.id, action.payload.shouldDeepMerge ? (0, _lodash2.default)({}, state[action.payload.id], action.payload.state) : _extends({}, state[action.payload.id], action.payload.state)));
      }

    default:
      {
        return state;
      }
  }
};