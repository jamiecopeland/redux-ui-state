import React from 'react';

import { addReduxUIState } from 'redux-ui-state';

const Thing = ({ uiState, setUIState }) => {
  return (
    <div>
      <div>message: {uiState.message}</div>
      <div>isToggled: {uiState.isToggled ? 'true' : 'false'}</div>

      <button onClick={
        () => setUIState({ message: 'hello from action' })
      }
      >Set message</button>
      <button onClick={
        () => setUIState({ isToggled: !uiState.isToggled })
      }
      >toggle toggle</button>
    </div>
  );
};

Thing.propTypes = {
  uiState: React.PropTypes.object,
  setUIState: React.PropTypes.func,
};

export default addReduxUIState({
  id: 'thing',
  getInitialState: () => ({
    message: 'hello from getInitialState',
    isToggled: false,
  }),
})(Thing);


import { connect } from 'react-redux';

const StateWrappedComponent = addReduxUIState({
  id: 'thing',
  getInitialState: () => ({
    message: 'hello from getInitialState',
    isToggled: false,
  }),
})(Thing);


function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps)(StateWrappedComponent);
