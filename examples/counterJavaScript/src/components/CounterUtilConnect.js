import React from 'react';
import { compose } from 'redux';

import { addReduxUIState, createConnectWrapper } from 'redux-ui-state';

const Counter = ({ uiState, setUIState }) => (
  <div>
    <div>
      {uiState.index}
    </div>
    <div>
      <button onClick={() => setUIState({ index: uiState.index - 1 })}>-</button>
      <button onClick={() => setUIState({ index: uiState.index + 1 })}>+</button>
    </div>
  </div>
);

// Counter.propTypes = {
//   uiState: React.PropTypes.object.isRequired,
//   setUIState: React.PropTypes.func.isRequired,
// };

const config = {
  id: 'counterUtil',
  getInitialState: () => ({ index: 0 }),
};

export default compose(
  createConnectWrapper(),
  addReduxUIState(config)
)(Counter);
