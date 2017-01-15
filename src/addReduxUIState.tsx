import * as React from 'react';
import { Dispatch, Action } from 'redux';

import { setUIState, replaceUIState, destroyUIState } from './actions';

/**
 * The default shape of a store containing the uiState reducer
 */
export interface DefaultStateShape {
  // This is slightly gross and involves repetition of the value in DEFAULT_BRANCH_NAME, but
  // TypeScript doesn't allow: [DEFAULT_BRANCH_NAME]: ReduxUIBranchState;
  uiState: UIStateBranch;
}

/**
 * The branch of the Redux store governed by reduxUIState's reducer
 */
export interface UIStateBranch {
  components: Record<string, any>; // tslint:disable-line:no-any
}

/**
 * The shape of the config object to be passed to addReduxUIState
 */
export interface AddReduxUIStateConfig<S, P> {
  id: string;
  getInitialState: (props?: P) => S;
  destroyOnUnmount?: boolean;
}

/**
 * The state props passed into a component wrapped by addReduxUIState
 */
export interface StateProps<S> {
  uiState: S;
}

/**
 * The dispatch props passed into a component wrapped by addReduxUIState
 */
export interface DispatchProps<S> {
  setUIState: (state: S) => void;
  replaceUIState: (state: S) => void;
  resetUIState: () => void;
  destroyUIState: () => void;
}

/**
 * All the props props passed into a component wrapped by addReduxUIState
 */
export type Props<S> = StateProps<S> & DispatchProps<S>;

/**
 * Extracts the state for a particutlar component from the UIStateBranch of the state tree
 */
function getComponentStateFromUIStateBranch<S>(state: UIStateBranch, id: string): StateProps<S> {
  return {
    uiState: state.components[id],
  };
}

/**
 * Creates the dispatch props for the wrapped component
 */
function mapDispatchToProps<S, P>(
  dispatch: Dispatch<DefaultStateShape>,
  props: P,
  id: string,
  getInitialState: (props: P) => S
): DispatchProps<S> {
  return {
    setUIState: (state: S): Action => dispatch(setUIState<S>({
      id,
      state: state,
    })),
    replaceUIState: (state: S): Action => dispatch(replaceUIState<S>({
      id,
      state: state,
    })),
    resetUIState: (): Action => dispatch(replaceUIState<S>({
      id,
      state: getInitialState(props),
    })),
    destroyUIState: (): Action => dispatch(destroyUIState({
      id,
    })),
  };
}

// addReduxUIState

export interface ExportedComponentStateProps {
  uiStateBranch: UIStateBranch;
}

export interface ExportedComponentDispatchProps {
  dispatch: Dispatch<DefaultStateShape>;
}

export type ExportedComponentProps = ExportedComponentStateProps & ExportedComponentDispatchProps;

export const omitReduxUIProps = (props: ExportedComponentProps) => {
  let cleanedProps = {...props};
  delete cleanedProps.uiStateBranch;
  delete cleanedProps.dispatch;
  return cleanedProps;
};

export const addReduxUIState = <S, P>(
  { id, getInitialState, destroyOnUnmount }: AddReduxUIStateConfig<S, P>
) => (WrappedComponent: React.StatelessComponent<P & Props<S>>): React.ComponentClass<ExportedComponentProps & P> =>
class ExportedComponent extends React.Component<ExportedComponentProps & P, {}> {
  static displayName = 'ReduxUIStateHOC';

  mappedDispatchProps: DispatchProps<S>;

  constructor(props: ExportedComponentProps & P) {
    super(props);

    if (!props.uiStateBranch || !props.dispatch) {
      throw new Error(
        'Cannot find uiStateBranch and dispatch in props. This probably means you\'re using ' +
        'addReduxUIState rather than connectReduxUIState and havent passed the required props' +
        'through in your component\'s mapStateToProps and mapDispatchToProps functions.'
      );
    }
    this.mappedDispatchProps = mapDispatchToProps<S, P>(this.props.dispatch, props, id, getInitialState);
  }

  componentDidMount() {
    this.mappedDispatchProps.setUIState(getInitialState(this.props));
  }

  componentWillUnmount() {
    if (destroyOnUnmount) {
      this.mappedDispatchProps.destroyUIState();
    }
  }

  render() {
    const mappedStateProps = getComponentStateFromUIStateBranch(this.props.uiStateBranch, id);
    return mappedStateProps.uiState
      ? <WrappedComponent
          {...Object.assign(
              mappedStateProps, this.mappedDispatchProps, omitReduxUIProps(this.props)
          )}
      />
      : null;
  };
};
