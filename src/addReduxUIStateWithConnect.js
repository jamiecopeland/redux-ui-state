import { compose } from 'redux';

import { createConnectWrapper } from './utils';
import addReduxUIState from './addReduxUIState';

const addReduxUIStateWithConnect = ({ id, getInitialState }) => Component => compose(
  createConnectWrapper(),
  addReduxUIState({ id, getInitialState })
)(Component);

export default addReduxUIStateWithConnect;
