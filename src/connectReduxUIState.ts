import { ComponentClass, StatelessComponent } from 'react';

import { createConnectWrapper } from './utils';
import { addReduxUIState } from './addReduxUIState';
import { AddReduxUIStateConfig, StateProps, DispatchProps } from './addReduxUIState';

export const connectReduxUIState = <TUIState, TProps>
  ({ id, getInitialState }: AddReduxUIStateConfig<TUIState, TProps>) =>
  (
    Component:
      StatelessComponent<StateProps<TUIState> & DispatchProps<TUIState> & TProps> |
      ComponentClass<StateProps<TUIState> & DispatchProps<TUIState> & TProps>
  ): ComponentClass<TProps> =>
  createConnectWrapper<TProps>()(addReduxUIState<TUIState, TProps>({ id, getInitialState })(Component));
