import React from 'react';

import { defaultUiBranchAccessor, omit } from './utils';
import { setUIState, replaceUIState } from './actions';

export const addReduxUIState = (
  config, uiBranchAccessor = defaultUiBranchAccessor
) => WrappedComponent => {
  function mapPropsToProps(props) {
    const { state, dispatch } = props;
    return {
      ...omit(props, ['state', 'dispatch']),
      uiState: uiBranchAccessor(state)[config.id],
      setUIState: (newState, shouldDeepMerge) => {
        dispatch(setUIState({
          id: config.id,
          shouldDeepMerge,
          state: newState,
        }));
      },
      replaceUIState: (newState) => {
        dispatch(replaceUIState({
          id: config.id,
          state: newState,
        }));
      },
      resetUIState: () => {
        dispatch(replaceUIState({
          id: config.id,
          state: config.getInitialState(props),
        }));
      },
      dispatch,
    };
  }

  class ExportedComponent extends React.Component {

    static propTypes = {
      uiState: React.PropTypes.object,
      setUIState: React.PropTypes.func.isRequired,
      replaceUIState: React.PropTypes.func.isRequired,
      resetUIState: React.PropTypes.func.isRequired,
    };

    componentDidMount() {
      this.props.setUIState(config.getInitialState(this.props));
    }

    render() {
      return (
        this.props.uiState
        ? <WrappedComponent {...this.props} />
        : null
      );
    }

  }

  return props => (<ExportedComponent {...mapPropsToProps(props)} />);
};
