import React from 'react';

import { setUIState, replaceUIState } from './actions';

const mapStateToProps = (state, id) => ({
  uiState: state.components[id],
});

const mapDispatchToProps = (dispatch, props, id, getInitialState) => ({
  setUIState: (newState, shouldDeepMerge) => dispatch(setUIState({
    id,
    shouldDeepMerge,
    state: newState,
  })),
  replaceUIState: newState => dispatch(replaceUIState({
    id,
    state: newState,
  })),
  resetUIState: () => dispatch(replaceUIState({
    id,
    state: getInitialState(props),
  })),
});

const addReduxUIState = (
  { id, getInitialState, destroyOnUnmount }
) => WrappedComponent => class ExportedComponent extends React.Component {
  static propTypes = {
    uiStateBranch: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    if (!props.uiStateBranch || !props.dispatch) {
      throw new Error(
        'Cannot find uiStateBranch and dispatch in props. This probably means you\'re using ' +
        'addReduxUIState rather than addReduxUISTateWithConnect and havent passed the required ' +
        'props through in your component\'s mapStateToProps and mapDispatchToProps functions.'
      );
    }
    this.mappedDispatchProps = mapDispatchToProps(this.props.dispatch, props, id, getInitialState);
  }

  componentDidMount() {
    this.mappedDispatchProps.setUIState(getInitialState(this.props));
  }

  componentWillUnmount() {
    if (destroyOnUnmount) {
      this.mappedDispatchProps.resetUIState();
    }
  }

  render() {
    const mappedStateProps = mapStateToProps(this.props.uiStateBranch, id);
    return (
      mappedStateProps.uiState
      ? (
        <WrappedComponent {...{
          ...mappedStateProps,
          ...this.mappedDispatchProps,
        }}
        />
      )
      : null
    );
  }
};

export default addReduxUIState;
