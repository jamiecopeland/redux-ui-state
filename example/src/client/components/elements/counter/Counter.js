import React from 'react';
import { connect } from 'react-redux';

import { addReduxUIState, defaultMapStateToProps, defaultMapDispatchToProps } from 'redux-ui-state';

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

Counter.propTypes = {
  uiState: React.PropTypes.object.isRequired,
  setUIState: React.PropTypes.func.isRequired,
};

const StateWrappedComponent = addReduxUIState({
  id: 'counter',
  useConnect: true,
  getInitialState: () => ({ index: 0 }),
})(Counter);

// export default connect(defaultMapStateToProps, defaultMapDispatchToProps)(StateWrappedComponent);
export default StateWrappedComponent;
