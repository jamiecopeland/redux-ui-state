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

// Initial State

/**
 * A string or a function accepting the props as an argument and returning a string
 */
export type Id<TProps> = string | ((props: TProps) => string);

/**
 * A type guard guaranteeing id is a string;
 */
export function idIsString<TProps>(id: Id<TProps>): id is string {
  return typeof id === 'string';
}

/**
 * A type guard guaranteeing id is a function that accepts props and returns a string
 */
export function idIsFunction<TProps>(id: Id<TProps>): id is (props: TProps) => string {
  return typeof id === 'function';
}

/**
 * Returns a string or undefined from the union type of (string | function that returns string)
 */
export function getStringFromId<TProps>(id: Id<TProps>, props: TProps): string | undefined {
  if (idIsString(id)) {
    return id;
  }

  if (idIsFunction(id)) {
    return id(props);
  }

  return undefined;
}

// Initial State
export type InitialStateFunction<TUIState, TProps> = ((props: TProps, existingState?: TUIState) => TUIState);
export type InitialState<TUIState, TProps> = TUIState | InitialStateFunction<TUIState, TProps>;

export function initialStateIsString<TUIState, TProps>(
  initialState: InitialState<TUIState, TProps>
): initialState is TUIState {
  return typeof initialState === 'string';
}

export function initialStateIsFunction<TUIState, TProps>(
  initialState: InitialState<TUIState, TProps>
): initialState is (props: TProps) => TUIState {
  return typeof initialState === 'function';
}

export function getInitialStateValue<TUIState, TProps>(
  initialState: InitialState<TUIState, TProps>, props: TProps, existingState?: TUIState
): TUIState {
  if (typeof initialState === 'object') {
    return initialState as TUIState;
  }

  if (typeof initialState === 'function') {
    return (initialState as InitialStateFunction<TUIState, TProps>)(props, existingState);
  }

  return undefined;
}

/**
 * The shape of the config object to be passed to addReduxUIState
 */
export interface AddReduxUIStateConfig<TUIState, TProps> {
  id: Id<TProps>;
  initialState: InitialState<TUIState, TProps>;
  destroyOnUnmount?: boolean;
}

export interface AddReduxUIStateConfigWithTransform<TUIState, TProps, TTransformedProps> extends AddReduxUIStateConfig<TUIState, TProps> {
  transformProps: (uiState: TUIState, ownProps: TProps, dispatchProps: DispatchProps<TUIState>) => TTransformedProps;
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
  initialState: InitialState<TUIState, TProps>
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
      state: getInitialStateValue(initialState, props),
    })),
    destroyUIState: (): Action => dispatch(destroyUIState({
      id,
    })),
  };
}

export type RawInputComponent<Props> = React.StatelessComponent<Props> | React.ComponentClass<Props>;

export type InputComponent<TUIState, TProps> = RawInputComponent<TProps & Props<TUIState>>;
export type InputComponentWithTransform<TUIState, TProps, TTransformedProps> = RawInputComponent<TProps & TTransformedProps>; // tslint:disable-line:max-line-length

export function addReduxUIState<TUIState, TProps>(
  config: AddReduxUIStateConfig<TUIState, TProps>
): (WrappedComponent: InputComponent<TUIState, TProps>) => React.ComponentClass<TProps>;

export function addReduxUIState<TUIState, TProps, TTransformedProps>(
  config: AddReduxUIStateConfigWithTransform<TUIState, TProps, TTransformedProps>
): (WrappedComponent: InputComponentWithTransform<TUIState, TProps, TTransformedProps>) => React.ComponentClass<TProps>;

export function addReduxUIState<TUIState, TProps, TTransformedProps>(
  config: AddReduxUIStateConfigWithTransform<TUIState, TProps, TTransformedProps>
) {
  const { id, initialState } = config;
  return (WrappedComponent: InputComponent<TUIState, TProps>): React.ComponentClass<TProps> =>
    class ExportedComponent extends React.PureComponent<TProps, {uiState: TUIState}> {
      static contextTypes = contextTypes;
      static displayName = 'ReduxUIStateHOC';

      mappedDispatchProps: DispatchProps<TUIState>;
      unsubscribeFromStore: () => void;

      constructor(props: TProps, context: Context<any>) { // tslint:disable-line:no-any
        super(props);

        this.state = {
          uiState: undefined,
        };

        const idString = getStringFromId(id, this.props);

        if (!idString) {
          throw new Error(`
            Cannot find id in the addReduxUISTate config.
            An id must be specified in order to uniquely identify a particular piece of ui state
          `);
        }

        this.mappedDispatchProps = mapDispatchToProps<TUIState, TProps>(
          context.reduxUIState.store.dispatch, props, idString, initialState
        );
      }

      getComponentState() {
        const { store, branchSelector } = this.context.reduxUIState;
        return getComponentStateFromUIStateBranch<TUIState>(
          branchSelector(store.getState()), getStringFromId(id, this.props)
        );
      }

      componentWillMount() {
        this.unsubscribeFromStore = this.context.reduxUIState.store.subscribe(
          () => this.setState({uiState: this.getComponentState()})
        );
      }

      componentDidMount() {
        this.mappedDispatchProps.setUIState(
          getInitialStateValue(initialState, this.props, this.getComponentState())
        );
      }

      componentWillUnmount() {
        this.unsubscribeFromStore();
      }

      render() {

        const uiState = this.getComponentState();

        if (uiState) {
          const props = config.transformProps
            ? config.transformProps(this.state.uiState, this.props, this.mappedDispatchProps)
            : Object.assign({ uiState: this.state.uiState }, this.mappedDispatchProps, this.props);

          return <WrappedComponent {...props} />;
        }

        return null;
      }
    };
}