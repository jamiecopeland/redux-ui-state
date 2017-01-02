import * as React from 'react';
import { Dispatch } from 'redux';

import { setUIState, replaceUIState } from './actions';

// The branch of the Redux store governed by reduxUIState's reducer
export interface UIStateBranch {
  components: {
    [key: string]: any;
  }
}

export interface AddReduxUIStateConfig<S, P> {
  id: string;
  getInitialState: (props?: P) => S;
  destroyOnUnmount?: boolean;
}

export interface StateProps<S> {
  uiState: S;
}

export interface DispatchProps<S> {
  setUIState: (state: S) => void;
  replaceUIState: (state: S) => void;
  resetUIState: () => void;
}

export type Props<S> = StateProps<S> & DispatchProps<S>;

function getComponentStateFromUIStateBranch<S>(state: UIStateBranch, id: string): StateProps<S> {
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

// addReduxUIState

export interface ExportedComponentStateProps {
  uiStateBranch: UIStateBranch;
  ownProps: Object;
}

export interface ExportedComponentDispatchProps {
  dispatch: Function;
}

export type ExportedComponentProps = ExportedComponentStateProps & ExportedComponentDispatchProps;

export const addReduxUIState = <S, P>(
  { id, getInitialState, destroyOnUnmount }: AddReduxUIStateConfig<any, any>
) => (WrappedComponent: React.StatelessComponent<P & Props<S>>): React.ComponentClass<ExportedComponentProps & P> =>
class ExportedComponent extends React.Component<ExportedComponentProps & P, any> {
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
    const mappedStateProps = getComponentStateFromUIStateBranch(this.props.uiStateBranch, id);
    return mappedStateProps.uiState
      ? <WrappedComponent
          {...Object.assign(mappedStateProps, this.mappedDispatchProps, this.props.ownProps)}
        />
      : null;
  };
};
