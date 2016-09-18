import React from 'react';

import { setUIState, replaceUIState } from './actions';

const addReduxUIState = (
  { id, getInitialState, destroyOnUnmount }
) => WrappedComponent => {
  function mapStateToProps(state) {
    return {
      uiState: state.components[id],
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

  const ProxyComponent = (props) => {
    if (!props.uiStateBranch || !props.dispatch) {
      throw new Error(
        'Cannot find state and dispatch in props. This probably means you\'re using ' +
        'addReduxUIState with useConnect set to false but havent passed state and dispatch ' +
        'in your component\'s mapStateToProps and mapDispatchToProps functions.'
      );
    }
    return (
      <ExportedComponent {...{
        ...mapStateToProps(props.uiStateBranch),
        ...mapDispatchToProps(props.dispatch),
      }}
      />
    );
  };
  ProxyComponent.propTypes = {
    uiStateBranch: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  };

  return ProxyComponent;
};

export default addReduxUIState;

