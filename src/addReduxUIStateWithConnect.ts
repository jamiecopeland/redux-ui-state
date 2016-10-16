import { compose } from 'redux';
import { ComponentClass } from 'react';

import { createConnectWrapper } from './utils';
import addReduxUIState from './addReduxUIState';

const addReduxUIStateWithConnect = ({ id, getInitialState }) => (Component): ComponentClass<{}> =>
  createConnectWrapper()(addReduxUIState({ id, getInitialState })(Component));

export default addReduxUIStateWithConnect;
