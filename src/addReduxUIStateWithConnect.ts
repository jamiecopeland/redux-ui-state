import { compose } from 'redux';
import { ComponentClass } from 'react';

import { createConnectWrapper } from './utils';
import addReduxUIState, { StateProps, DispatchProps } from './addReduxUIState';
import { AddReduxUIStateConfig } from './addReduxUIState';

const addReduxUIStateWithConnect = <S, P>
  ({ id, getInitialState }: AddReduxUIStateConfig<S, P>) =>
  (Component): ComponentClass<P> =>
  createConnectWrapper<P>()(addReduxUIState<S, P>({ id, getInitialState })(Component));

export default addReduxUIStateWithConnect;
