import * as React from 'react';
import {
  // TODO Tidy order
  DispatchProps,
  InputComponent,
  InputComponentWithTransform,
  ExportedComponentProps,
  Id,
  getStringFromId,
  mapDispatchToProps,
  getComponentStateFromUIStateBranch,
  omitReduxUIProps,
  TransformPropsFunc
} from './utils';

export function addReduxUIState<TUIState, TProps>(
  id: Id<TProps>,
): (WrappedComponent: InputComponent<TUIState, TProps>) => React.ComponentClass<ExportedComponentProps & TProps>;

export function addReduxUIState<TUIState, TProps, TTransformedProps>(
  id: Id<TProps>,
  transformProps: TransformPropsFunc<TUIState, TProps, TTransformedProps>
): (WrappedComponent: InputComponentWithTransform<TUIState, TProps, TTransformedProps>) => (
  React.ComponentClass<ExportedComponentProps & TProps>
);

export function addReduxUIState<TUIState, TProps, TTransformedProps>(
  id: Id<TProps>,
  transformProps?: TransformPropsFunc<TUIState, TProps, TTransformedProps>
) {
  return (WrappedComponent: InputComponent<TUIState, TProps>): React.ComponentClass<ExportedComponentProps & TProps> => // tslint:disable-line:max-line-length
  class ExportedComponent extends React.PureComponent<TProps & ExportedComponentProps, {}> {
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

      this.mappedDispatchProps = mapDispatchToProps<TUIState, TProps>(this.props.dispatch, props, idString);
    }

    getComponentState() {
      return getComponentStateFromUIStateBranch<TUIState>(
        this.props.uiStateBranch, getStringFromId<Readonly<TProps>>(id, this.props)
      );
    }

    // TODO Add shouldComponentUpdate

    render() {
      const uiState = this.getComponentState();
      console.log('render:', this.props);
      if (uiState) {
        const props = transformProps
          ? transformProps(uiState, this.mappedDispatchProps, this.props as Readonly<TProps>)
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
