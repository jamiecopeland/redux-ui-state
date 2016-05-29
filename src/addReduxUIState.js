import React from 'react';

import { defaultUiBranchAccessor, omit } from './utils';
import { setUIState } from './actions';

// TODO Make sure to push props down to child, omitting uiState and dispatch
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


      dispatch,
    };
  }

  class ExportedComponent extends React.Component {

    static propTypes = {
      uiState: React.PropTypes.object,
      setUIState: React.PropTypes.func.isRequired,
    };

    componentDidMount() {
      this.props.setUIState(config.getInitialState(this.props));
    }

    render() {
      return (
        this.props.uiState
        ? <WrappedComponent
          {...this.props}
        />
        : null
      );
    }

  }

  return props => {
    console.log('props: ', props);
    return (<ExportedComponent {...mapPropsToProps(props)} />)
  };
};
