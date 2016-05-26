'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addReduxUIState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _utils = require('./utils');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var addReduxUIState = exports.addReduxUIState = function addReduxUIState(config) {
  var uiBranchAccessor = arguments.length <= 1 || arguments[1] === undefined ? _utils.defaultUiBranchAccessor : arguments[1];
  return function (WrappedComponent) {
    console.log('wtf');
    function mapDispatchToProps(dispatch) {
      return {
        setUIState: function setUIState(state, shouldDeepMerge) {
          return dispatch((0, _actions.setUIState)({
            id: config.id,
            shouldDeepMerge: shouldDeepMerge,
            state: state
          }));
        }
      };
    }

    function mapStateToProps(state) {
      console.log('state: ', state);
      console.log('state: ', uiBranchAccessor(state));
      return {
        uiState: uiBranchAccessor(state)[config.id]
      };
    }

    var ExportedComponent = function (_React$Component) {
      _inherits(ExportedComponent, _React$Component);

      function ExportedComponent() {
        _classCallCheck(this, ExportedComponent);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ExportedComponent).apply(this, arguments));
      }

      _createClass(ExportedComponent, [{
        key: 'componentDidMount',

        // resetUIState: React.PropTypes.func.isRequired,
        value: function componentDidMount() {
          console.log('calling setUIState');
          this.props.setUIState(config.getInitialState(this.props));
        }
      }, {
        key: 'render',
        value: function render() {
          return this.props.uiState ? _react2.default.createElement(WrappedComponent, (0, _utils.mapProps)(this.props)) : null;
        }
      }]);

      return ExportedComponent;
    }(_react2.default.Component);

    ExportedComponent.propTypes = {
      uiState: _react2.default.PropTypes.object,
      setUIState: _react2.default.PropTypes.func.isRequired };


    return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ExportedComponent);
  };
};