import * as React from 'react';
import { Dispatch, Action } from 'redux';

import { setUIState, replaceUIState, destroyUIState } from './actions';
import { contextTypes, Context } from './utils';

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
  getInitialState: (props?: TProps, existingState?: TUIState) => TUIState;
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
  // dispatch({type: 'hello'})
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

export const addReduxUIState = <TUIState, TProps>(
  { id, getInitialState, destroyOnUnmount = true }: AddReduxUIStateConfig<TUIState, TProps>
) => (WrappedComponent: React.StatelessComponent<TProps & Props<TUIState>> | React.ComponentClass<TProps & Props<TUIState>>): React.ComponentClass<TProps> => // tslint:disable-line:max-line-length
  class ExportedComponent extends React.PureComponent<TProps, {uiState: TUIState}> {
    static contextTypes = contextTypes;
    static displayName = 'ReduxUIStateHOC';

    mappedDispatchProps: DispatchProps<TUIState>;
    unsubscribeFromStore: () => void;

    constructor(props: TProps, context: Context) {
      super(props);

      this.state = {
        uiState: undefined,
      };

      if (!id) {
        throw new Error(
          `
          Cannot find id in config.
          An id must be specified in order to uniquely identify a particular piece of ui state
          `
        );
      }

      this.mappedDispatchProps = mapDispatchToProps<TUIState, TProps>(
        context.reduxUIState.store.dispatch, props, id, getInitialState
      );
    }

    getComponentState() {
      const { store, branchSelector } = this.context.reduxUIState;
      return getComponentStateFromUIStateBranch<TUIState>(branchSelector(store.getState()), id);
    }

    componentWillMount() {
      this.unsubscribeFromStore = this.context.reduxUIState.store.subscribe(
        () => this.setState({uiState: this.getComponentState()})
      );
    }

    componentDidMount() {
      this.mappedDispatchProps.setUIState(
        getInitialState(this.props, this.getComponentState())
      );
    }

    componentWillUnmount() {
      this.unsubscribeFromStore();
    }

    render() {
      const uiState = this.getComponentState();
      return uiState
        ? <WrappedComponent {...Object.assign({ uiState: this.state.uiState }, this.mappedDispatchProps, this.props)} />
        : null;
    }
  };
