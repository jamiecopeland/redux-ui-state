import * as React from 'react';
import { Dispatch } from 'redux';

import { setUIState, replaceUIState } from './actions';
import { merge } from './utils';

export interface AddReduxUIStateConfig<P, S> {
  id: string;
  getInitialState: (props?: P) => S;
  destroyOnUnmount?: boolean;
}

export interface UIStateBranch {
  components: {
    [key: string]: any;
  }
}

interface StateProps<S> {
  uiState: S;
}

interface DispatchProps<S> {
  setUIState: (state: S) => void;
  replaceUIState: (state: S) => void;
  resetUIState: () => void;
}

function mapStateToProps<S>(state: UIStateBranch, id: string): StateProps<S> {
  return {
    uiState: state.components[id],
  };
}

function mapDispatchToProps<S>(dispatch, props, id, getInitialState): DispatchProps<S> {
  return {
    setUIState: (state: S): void => dispatch(setUIState({
      id,
      state: state,
    })),
    replaceUIState: (state: S): void => dispatch(replaceUIState({
      id,
      state: state,
    })),
    resetUIState: (): void => dispatch(replaceUIState({
      id,
      state: getInitialState(props),
    })),
  };
}

interface ExportedComponentProps {
  uiStateBranch: UIStateBranch,
  dispatch: Function,
}

const addReduxUIState = <S, P>(
  { id, getInitialState, destroyOnUnmount }: AddReduxUIStateConfig<P, S>
) => (WrappedComponent: React.StatelessComponent<P>): React.ComponentClass<P> =>
class ExportedComponent extends React.Component<ExportedComponentProps & P & S, {}> {
  mappedDispatchProps: DispatchProps<S>;

  constructor(props) {
    super(props);
    if (!props.uiStateBranch || !props.dispatch) {
      throw new Error(
        'Cannot find uiStateBranch and dispatch in props. This probably means you\'re using ' +
        'addReduxUIState rather than addReduxUISTateWithConnect and havent passed the required ' +
        'props through in your component\'s mapStateToProps and mapDispatchToProps functions.'
      );
    }
    this.mappedDispatchProps = mapDispatchToProps<S>(this.props.dispatch, props, id, getInitialState);
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
    return mappedStateProps.uiState
      ? <WrappedComponent {...merge(mappedStateProps, this.mappedDispatchProps)} />
      : null;
  }
};

export default addReduxUIState
