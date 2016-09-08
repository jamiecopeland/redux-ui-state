import React from 'react';
import { connect } from 'react-redux';

import { defaultUiBranchSelector } from './utils';
import { setUIState, replaceUIState } from './actions';

export const addReduxUIState = (
  { id, getInitialState, useConnect, destroyOnUnmount },
  uiBranchSelector = defaultUiBranchSelector,
) => WrappedComponent => {
  function mapStateToProps(state) {
    return {
      uiState: uiBranchSelector(state).components[id],
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      setUIState: (newState, shouldDeepMerge) => {
        dispatch(setUIState({
          id,
          shouldDeepMerge,
          state: newState,
        }));
      },
      replaceUIState: (newState) => {
        dispatch(replaceUIState({
          id,
          state: newState,
        }));
      },
      resetUIState: () => {
        dispatch(replaceUIState({
          id,
          state: getInitialState(props),
        }));
      },
    };
  }

  class ExportedComponent extends React.Component {
    static propTypes = {
      uiState: React.PropTypes.object,
      setUIState: React.PropTypes.func,
      replaceUIState: React.PropTypes.func,
      resetUIState: React.PropTypes.func,
    };

    componentDidMount() {
      this.props.setUIState(getInitialState(this.props));
    }

    componentWillUnmount() {
      if (destroyOnUnmount) {
        this.props.resetUIState();
      }
    }

    render() {
      return (
        this.props.uiState
        ? <WrappedComponent {...this.props} />
        : null
      );
    }
  }

  let output;

  if (useConnect) {
    output = connect(mapStateToProps, mapDispatchToProps)(ExportedComponent);
  } else {
    const ProxyComponent = (props) => {
      if (!useConnect && (!props.state || !props.dispatch)) {
        throw new Error(
          'Cannot find state and dispatch in props. This probably means you\'re using ' +
          'addReduxUIState with useConnect set to false but havent passed state and dispatch ' +
          'in your component\'s mapStateToProps and mapDispatchToProps functions.'
        );
      }
      return (
        <ExportedComponent {...{
          ...mapStateToProps(props.state),
          ...mapDispatchToProps(props.dispatch),
        }}
        />
      );
    };
    ProxyComponent.propTypes = {
      state: React.PropTypes.object.isRequired,
      dispatch: React.PropTypes.func.isRequired,
    };
    output = ProxyComponent;
  }

  return output;
};

