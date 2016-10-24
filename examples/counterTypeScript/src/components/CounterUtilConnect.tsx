// import * as React from 'react';
// import { compose } from 'redux';

// import { addReduxUIState, createConnectWrapper } from 'redux-ui-state';

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

// // Counter.propTypes = {
// //   uiState: React.PropTypes.object.isRequired,
// //   setUIState: React.PropTypes.func.isRequired,
// // };

// const config = {
//   id: 'counterUtil',
//   getInitialState: () => ({ index: 0 }),
//   destroyOnUnmount: false,
// };

// export default compose(
//   createConnectWrapper(),
//   addReduxUIState<any, any>(config)
// )(Counter);


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
