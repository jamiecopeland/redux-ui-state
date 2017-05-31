import { ComponentClass } from 'react';

import {
  InputComponent, InputComponentWithTransform,
  createConnectWrapper, DefaultStateShape,
  Id, TransformPropsFunc
} from './utils';
import {
  addReduxUIState
} from './addReduxUIState';

export function connectReduxUIState<TUIState, TProps>(
  id: Id<TProps>,
): (WrappedComponent: InputComponent<TUIState, TProps>) => React.ComponentClass<TProps>;

export function connectReduxUIState<TUIState, TProps, TTransformedProps>(
  id: Id<TProps>,
  transformProps: TransformPropsFunc<TUIState, TProps, TTransformedProps>
): (WrappedComponent: InputComponentWithTransform<TUIState, TProps, TTransformedProps>) => React.ComponentClass<TProps>;

export function connectReduxUIState<TUIState, TProps, TTransformedProps>(
  id: Id<TProps>,
  transformProps?: TransformPropsFunc<TUIState, TProps, TTransformedProps>
) {
    return (
      Component: InputComponent<TUIState, TProps> | InputComponentWithTransform<TUIState, TProps, TTransformedProps>
    ): ComponentClass<TProps> => createConnectWrapper<TProps, DefaultStateShape>()(
        transformProps
          ? addReduxUIState<TUIState, TProps, TTransformedProps>(id, transformProps)(
              Component as InputComponentWithTransform<TUIState, TProps, TTransformedProps>
            )
          : addReduxUIState<TUIState, TProps>(id)(Component as InputComponent<TUIState, TProps> )
      );
  }
