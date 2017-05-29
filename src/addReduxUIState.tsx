import * as React from 'react';
import {
  DispatchProps,
  InputComponent,
  InputComponentWithTransform,
  ExportedComponentProps,

  Id,
  InitialState,

  getStringFromId,
  mapDispatchToProps,
  getInitialStateValue,
  getComponentStateFromUIStateBranch,
  omitReduxUIProps,
} from './utils';

/**
 * The shape of the config object to be passed to addReduxUIState
 */
export interface AddReduxUIStateConfig<TUIState, TProps> {
  id: Id<TProps>;
  initialState: InitialState<TUIState, TProps>;
  onUnmount?: (dispatchFunctions: DispatchProps<TUIState>, uiState: TUIState, props: Readonly<TProps>) => void;
}

export interface AddReduxUIStateConfigWithTransform<
  TUIState, TProps, TTransformedProps
> extends AddReduxUIStateConfig<TUIState, TProps> {
  transformProps: (
    uiState: TUIState, dispatchProps: DispatchProps<TUIState>, ownProps: Readonly<TProps>
  ) => TTransformedProps;
}

export function addReduxUIState<TUIState, TProps>(
  config: AddReduxUIStateConfig<TUIState, TProps>
): (WrappedComponent: InputComponent<TUIState, TProps>) => React.ComponentClass<ExportedComponentProps & TProps>;

export function addReduxUIState<TUIState, TProps, TTransformedProps>(
  config: AddReduxUIStateConfigWithTransform<TUIState, TProps, TTransformedProps>
): (WrappedComponent: InputComponentWithTransform<TUIState, TProps, TTransformedProps>) => (
  React.ComponentClass<ExportedComponentProps & TProps>
);

export function addReduxUIState<TUIState, TProps, TTransformedProps>(
  config: AddReduxUIStateConfigWithTransform<TUIState, TProps, TTransformedProps>
) {
  const { id, initialState, onUnmount } = config;
  return (WrappedComponent: InputComponent<TUIState, TProps>): React.ComponentClass<ExportedComponentProps & TProps> => // tslint:disable-line:max-line-length
  class ExportedComponent extends React.Component<TProps & ExportedComponentProps, {}> {
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

      const idString = getStringFromId<Readonly<TProps>>(id, this.props);

      if (!idString) {
        throw new Error(`
          Cannot find id in the addReduxUISTate config.
          An id must be specified in order to uniquely identify a particular piece of ui state
        `);
      }

      this.mappedDispatchProps = mapDispatchToProps<TUIState, TProps>(
        this.props.dispatch, props, idString, initialState
      );
    }

    getComponentState() {
      return getComponentStateFromUIStateBranch<TUIState>(
        this.props.uiStateBranch, getStringFromId<Readonly<TProps>>(id, this.props)
      );
    }

    componentWillUnmount() {
      if (onUnmount) {
        onUnmount(this.mappedDispatchProps, this.getComponentState(), omitReduxUIProps(this.props));
      }
    }

    componentDidMount() {
      this.mappedDispatchProps.setUIState(
        getInitialStateValue<TUIState, Readonly<TProps>>(initialState, this.props, this.getComponentState())
      );
    }

    render() {
      const uiState = this.getComponentState();

      if (uiState) {
        const props = config.transformProps
          ? config.transformProps(uiState, this.mappedDispatchProps, this.props as Readonly<TProps>)
          : { uiState, ...this.mappedDispatchProps, ...omitReduxUIProps(this.props) };
        // TODO Remove the any below once TypeScript 2.4 emerges
        // https://github.com/Microsoft/TypeScript/pull/13288
        // tslint:disable-next-line:no-any
        return <WrappedComponent {...props as any} />;
      }

      return null;
    };
  };
}
