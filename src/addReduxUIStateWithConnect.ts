import { compose } from 'redux';
import { ComponentClass } from 'react';

import { createConnectWrapper } from './utils';
import { StateProps, DispatchProps, addReduxUIState } from './addReduxUIState';
import { AddReduxUIStateConfig } from './addReduxUIState';

export const addReduxUIStateWithConnect = <S, P>
  ({ id, getInitialState }: AddReduxUIStateConfig<S, P>) =>
  (Component): ComponentClass<P> =>
  createConnectWrapper<P>()(addReduxUIState<S, P>({ id, getInitialState })(Component));

// export default addReduxUIStateWithConnect;
