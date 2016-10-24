// import * as React from 'react';
// import { connect } from 'react-redux';

// import { DEFAULT_BRANCH_NAME, addReduxUIState } from 'redux-ui-state';

// interface UIState {
//   index: number;
// }

// const Counter = ({ uiState, setUIState }) => (
//   <div>
//     <div>
//       {uiState.index}
//     </div>
//     <div>
//       <button onClick={() => setUIState({ index: uiState.index - 1 })}>-</button>
//       <button onClick={() => setUIState({ index: uiState.index + 1 })}>+</button>
//     </div>
//   </div>
// );

// export const uiBranchSelector = state => state[DEFAULT_BRANCH_NAME];
// export const mapDispatchToProps = dispatch => ({ dispatch });
// export const mapStateToProps = state => ({ uiStateBranch: uiBranchSelector(state) });

// const config = {
//   id: 'counterManual',
//   getInitialState: () => ({ index: 0 }),
//   destroyOnUpdate: false,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(addReduxUIState<UIState, {}>(config)(Counter));


import * as React from 'react';

import { addReduxUIStateWithConnect } from 'redux-ui-state';

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
  id: 'counter',
  getInitialState: () => ({ index: 0 }),
};

export default addReduxUIStateWithConnect(config)(Counter);
