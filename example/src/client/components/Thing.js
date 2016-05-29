import React from 'react';
import { connect } from 'react-redux';

import { addReduxUIState, decorateMapStateToProps, defaultMapStateToProps } from 'redux-ui-state';

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

const StateWrappedComponent = addReduxUIState({
  id: 'thing',
  getInitialState: () => ({
    message: 'hello from getInitialState',
    isToggled: false,
  }),
})(Thing);

function mapStateToProps(state) {
  return decorateMapStateToProps(state, {
    something: 'extra stuff from the state tree',
  });
}

export default connect(defaultMapStateToProps)(StateWrappedComponent);
