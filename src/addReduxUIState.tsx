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
export interface AddReduxUIStateConfig<TUIState, TProps> {
  id: string;
  getInitialState: (props?: Readonly<TProps>, existingState?: TUIState) => TUIState;
  destroyOnUnmount?: boolean;
}

/**
 * The state props passed into a component wrapped by addReduxUIState
 */
export interface StateProps<TUIState> {
  uiState: TUIState;
}

/**
 * The dispatch props passed into a component wrapped by addReduxUIState
 */
export interface DispatchProps<TUIState> {
  setUIState: (state: TUIState) => void;
  replaceUIState: (state: TUIState) => void;
  resetUIState: () => void;
  destroyUIState: () => void;
}

/**
 * All the props props passed into a component wrapped by addReduxUIState
 */
export type Props<TUIState> = StateProps<TUIState> & DispatchProps<TUIState>;

/**
 * Extracts the state for a particutlar component from the UIStateBranch of the state tree
 */
function getComponentStateFromUIStateBranch<TUIState>(state: UIStateBranch, id: string): TUIState {
  return state.components[id];
}

/**
 * Creates the dispatch props for the wrapped component
 */
function mapDispatchToProps<TUIState, TProps>(
  dispatch: Dispatch<DefaultStateShape>,
  props: TProps,
  id: string,
  getInitialState: (props: TProps, existingState?: TUIState) => TUIState
): DispatchProps<TUIState> {
  return {
    setUIState: (state: TUIState): Action => dispatch(setUIState<TUIState>({
      id,
      state: state,
    })),
    replaceUIState: (state: TUIState): Action => dispatch(replaceUIState<TUIState>({
      id,
      state: state,
    })),
    resetUIState: (): Action => dispatch(replaceUIState<TUIState>({
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

export const addReduxUIState = <TUIState, TProps>(
  { id, getInitialState, destroyOnUnmount = true }: AddReduxUIStateConfig<TUIState, TProps>
) => (WrappedComponent: React.StatelessComponent<TProps & Props<TUIState>> | React.ComponentClass<TProps & Props<TUIState>>): React.ComponentClass<ExportedComponentProps & TProps> => // tslint:disable-line:max-line-length
class ExportedComponent extends React.Component<ExportedComponentProps & TProps, {}> {
  static displayName = 'ReduxUIStateHOC';

  mappedDispatchProps: DispatchProps<TUIState>;

  constructor(props: ExportedComponentProps & TProps) {
    super(props);
    const missingReduxPropsMessage = 'This probably means you\'re using addReduxUIState rather than ' +
      'connectReduxUIState and havent passed the required props through in your component\'s mapStateToProps and' +
      'mapDispatchToProps functions.';

    if (!props.uiStateBranch) {
      throw new Error(`Cannot find uiStateBranch in props. ${missingReduxPropsMessage}`);
    }

    if (!props.dispatch) {
      throw new Error(`Cannot find dispatch in props. ${missingReduxPropsMessage}`);
    }

    if (!id) {
      throw new Error(
        `Cannot find id in config. An id must be specified in order to uniquely identify a particular piece of ui state`
      );
    }

    this.mappedDispatchProps = mapDispatchToProps<TUIState, TProps>(this.props.dispatch, props, id, getInitialState);
  }

  componentDidMount() {
    this.mappedDispatchProps.setUIState(
      getInitialState(this.props, getComponentStateFromUIStateBranch<TUIState>(this.props.uiStateBranch, id))
    );
  }

  componentWillUnmount() {
    if (destroyOnUnmount) {
      this.mappedDispatchProps.destroyUIState();
    }
  }

  render() {
    const uiState = getComponentStateFromUIStateBranch(this.props.uiStateBranch, id);
    return uiState
      ? <WrappedComponent
          {...Object.assign(
              { uiState }, this.mappedDispatchProps, omitReduxUIProps(this.props)
          )}
      />
      : null;
  };
};
