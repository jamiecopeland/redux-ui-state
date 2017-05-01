# Redux UI State

UI state management for Redux applications - move component state into the store.

## What

* Cleanly and transparently share UI state between React components
* Inspect your entire application state (and allow full time travel debugging)

## Why

### Specifically

Most applications have user interface state - component visibility toggles and mode settings etc - that need to be shared
between siblings or up and down a hierarchy.

This can be achieved by having a parent that passes its locally stored component state, along with a change handler function, down through intermediate hierarchies, to children that are interested. This works but has several downsides:

* Increased complexity
* Repeated manual work
* Requires intermediate components in a hierarchy to have knowledge of data that isn't their concern
* Hard to debug

Redux UI State aims to transparently provide named containers for user interface data at any level of a hierarchy through the use of a higher order component.


### Generally

A long time ago in a galaxy far far away there was a pattern called Flux - revolutionary in Javascriptland it employed
a uni-directional data flow that hugely simplified state management from what had come before it. Shortly after that
Redux appeared, simplifying the model again by swapping out Flux's multi-store model for a single state atom.

This second iteration presented a simpler state model that was much easier to debug, allowing the entire application
state to be inspected, serialized and modified with minimum effort via sophisticated dev tools.

Keeping state in a component is equivalent to having multiple stores, increasing complexity and making debugging harder. Redux UI state aims to prevent this complexity from slipping in through the back door by providing an API identical to React's state management functionality but doing it via the Redux single-state-atom architecture.

## How

```
npm install redux-ui-state -s
```

## Getting started

### 1. Create the reducer:

_NOTE: This is the most simple, default implementation. In a more complex application, the reducer can be moved to a custom location within your store._

Your root reducer should look this:

```javascript
// rootReducer.js

import { combineReducers } from 'redux';
import { reducer, DEFAULT_BRANCH_NAME } from 'redux-ui-state';

export default combineReducers({
  [DEFAULT_BRANCH_NAME]: reducer
});

```

### 2. Connect one or more components:

Use the `addReduxUIState` higher order component to inject state props:
* `uiState` prop should be used in place of `this.state`
* `setUIState` prop should be used in place of `this.setState`

#### Static Config

```javascript
// Counter.js

import React from 'react';
import { addReduxUIState } from 'redux-ui-state';

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

const config = {
  id: 'counter',
  initialState: { index: 0 },
};

export default connectReduxUIState(config)(Counter);
```

```javascript
// App.js

import React from 'react';
import Counter from './Counter';

// Both instances of Counter will share the same state
const App = () => (
  <div>
    <Counter />
    <div>
      <Counter />
    <div>
  </div>
);

export default App;
```

#### Dynamic Config

```javascript
// Counter.js

import React from 'react';

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

// The first argument passed to id and initialState is the component props
const config = {
  id: ({ uiStateId }) => uiStateId,
  initialState: ({ initialValue }) => ({ index: initialValue }),
};

export default connectReduxUIState(config)(Counter);
```

```javascript
// App.js

import React from 'react';

// Both instances of Counter with an id of counter1 will share the same state.
// Correspondinly, only one of the instances needs to be initialized.
// If both are initialized with different values, the final value will be that of the last one to be created - the one furthest down the JSX.
const App = () => (
  <div>
    <Counter uiStateId="counter1" initialValue={42} />
    <div>
      <Counter uiStateId="counter1" />
      <Counter uiStateId="counter2" initialValue={666} />
    <div>
  <div>
)
```

### Bootstrap the application

Ensure your application sits below the Redux UI state provider in the component hierarchy.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import { Provider as ReduxUIStateProvider, defaultBranchSelector } from 'redux-ui-state';

import App from './components/App';
import rootReducer from './reducers/index';

const store = createStore(rootReducer);
const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <ReduxUIStateProvider
        store={store}
        branchSelector={defaultBranchSelector}
      >
        <App />
      </ReduxUIStateProvider>
    </Provider>,
    rootEl
  );
}

render();
```