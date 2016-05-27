import React from 'react';

import { defaultUiBranchAccessor } from './utils';
import { setUIState } from './actions';

// TODO Make sure to push props down to child, omitting uiState and dispatch
export const addReduxUIState = (
  config, uiBranchAccessor = defaultUiBranchAccessor
) => WrappedComponent => {
  function mapPropsToProps({ state, dispatch }) {
    return {
      uiState: uiBranchAccessor(state)[config.id],
      dispatch,
    };
  }

  class ExportedComponent extends React.Component {

    static propTypes = {
      uiState: React.PropTypes.object,
      dispatch: React.PropTypes.func.isRequired,
    };

    componentDidMount() {
      this.setUIState(config.getInitialState(this.props));
    }

    setUIState = (newState, shouldDeepMerge) => {
      this.props.dispatch(
        setUIState({
          id: config.id,
          shouldDeepMerge,
          state: newState,
        })
      );
    }

    render() {
      return (
        this.props.uiState
        ? <WrappedComponent
          {...this.props}
          setUIState={this.setUIState}
        />
        : null
      );
    }

  }

  return (state) => (<ExportedComponent {...mapPropsToProps(state)} />);
};
