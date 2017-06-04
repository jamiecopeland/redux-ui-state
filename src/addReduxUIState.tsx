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
  transformFunction: TransformPropsFunc<TUIState, TProps, TTransformedProps>
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

      const idString = this.getId();

      if (!idString) {
        throw new Error(`
          Cannot find id in the addReduxUISTate config.
          An id must be specified in order to uniquely identify a particular piece of ui state
        `);
      }
      this.defineMappedDispatchProps(idString, props);
    }

    getId() {
      return getStringFromId<Readonly<TProps>>(id, this.props);
    }

    getComponentState() {
      return getComponentStateFromUIStateBranch<TUIState>(
        this.props.uiStateBranch, this.getId()
      );
    }

    defineMappedDispatchProps(idString: string, props: TProps & ExportedComponentProps) {
      this.mappedDispatchProps = mapDispatchToProps<TUIState, TProps>(props.dispatch, props, idString);
    }

    componentWillUpdate(nextProps: TProps & ExportedComponentProps) {
      // If the id changes update the dispatch props
      const nextIdString = getStringFromId<Readonly<TProps>>(id, nextProps);
      if (nextIdString !== getStringFromId<Readonly<TProps>>(id, this.props)) {
        this.defineMappedDispatchProps(nextIdString, nextProps);
      }
    }

    shouldComponentUpdate(nextProps: ExportedComponentProps & TProps) {
      return (
        getStringFromId<Readonly<TProps>>(id, nextProps) !== getStringFromId<Readonly<TProps>>(id, this.props)
        ||
        getComponentStateFromUIStateBranch<TUIState>(nextProps.uiStateBranch, this.getId()) !== this.getComponentState()
      );
    }

    render() {
      const uiState = this.getComponentState();
      if (uiState) {
        return (
          <WrappedComponent
          {
            ...(
              transformProps
                ? transformProps(uiState, this.mappedDispatchProps, omitReduxUIProps(this.props))
                : { uiState, ...this.mappedDispatchProps, ...omitReduxUIProps(this.props) }
            )
          }
          />
        );
      }

      return null;
    };
  };
}
