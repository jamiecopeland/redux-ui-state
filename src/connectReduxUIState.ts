import { ComponentClass } from 'react';

import {
  InputComponent, InputComponentWithTransform,
  createConnectWrapper, DefaultStateShape,
} from './utils';
import {
  AddReduxUIStateConfig, AddReduxUIStateConfigWithTransform, addReduxUIState
} from './addReduxUIState';

export function connectReduxUIState<TUIState, TProps>(
  config: AddReduxUIStateConfig<TUIState, TProps>
): (WrappedComponent: InputComponent<TUIState, TProps>) => React.ComponentClass<TProps>;

export function connectReduxUIState<TUIState, TProps, TTransformedProps>(
  config: AddReduxUIStateConfigWithTransform<TUIState, TProps, TTransformedProps>
): (WrappedComponent: InputComponentWithTransform<TUIState, TProps, TTransformedProps>) => React.ComponentClass<TProps>;

export function connectReduxUIState<TUIState, TProps, TTransformedProps>
  ({ id, initialState, transformProps }: AddReduxUIStateConfigWithTransform<TUIState, TProps, TTransformedProps>) {
    return (
      Component: InputComponent<TUIState, TProps> | InputComponentWithTransform<TUIState, TProps, TTransformedProps>
    ): ComponentClass<TProps> => createConnectWrapper<TProps, DefaultStateShape>()(
        transformProps
          ? addReduxUIState<TUIState, TProps, TTransformedProps>({ id, initialState, transformProps })(
              Component as InputComponentWithTransform<TUIState, TProps, TTransformedProps>
            )
          : addReduxUIState<TUIState, TProps>({ id, initialState })(Component as InputComponent<TUIState, TProps> )
      );
  }
