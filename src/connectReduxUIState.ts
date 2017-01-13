import { ComponentClass, StatelessComponent } from 'react';

import { createConnectWrapper } from './utils';
import { addReduxUIState } from './addReduxUIState';
import { AddReduxUIStateConfig, StateProps, DispatchProps } from './addReduxUIState';

export const connectReduxUIState = <S, P>
  ({ id, getInitialState }: AddReduxUIStateConfig<S, P>) =>
  (Component: StatelessComponent<StateProps<S> & DispatchProps<S> & P>): ComponentClass<P> =>
  createConnectWrapper<P>()(addReduxUIState<S, P>({ id, getInitialState })(Component));
