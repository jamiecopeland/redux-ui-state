# Redux UI State

## What?

UI state management for Redux applications – moving component state out into the store.

## Why?
Redux is a predictable state container primarly because it has a single state object. This allows developers to inspect
the entire state of an application at any given time and to do magical things like time travel debugging. Keeping
everything in one place is what meant that Redux won out over the traditional multi store Flux architecture(s) yet most
React applications let multiple data stores in through the back door by using `this.setState` in components. As soon as
this happens the Redux single state atom principle breaks down - the entire application state cannot be inspected and
full time travel debugging becomes impossible.

Redux UI State aims to make storing what would traditionally be considered component state in a Redux store simple and
transparent.

## Installation
```
npm install redux-ui-state
```

## Getting started

NOTE: This is the most simple, default implementation. The reducer can be moved to a custom location within your store and
the props passed directly into the HOC rather using the connect utility. Custom implementations are shown in the
counter example.

### 1. Create the reducer:

Your root reducer should look this:

```
import { pojoReducer, DEFAULT_BRANCH_NAME } from 'redux-ui-state';

export default (state = {}, action) => ({
  [DEFAULT_BRANCH_NAME]: pojoReducer(state[DEFAULT_BRANCH_NAME], action),
});
```

### 2. Connect a component using the auto connect utility:

Use the `connectReduxUIState` higher order component to inject `uiState` (to be used in place of `this.state`) and
`setUIState` (to be used in place of `this.setState`) into your component.

```
const Counter = ({
  uiState, setUIState
}) => (
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

const config: AddReduxUIStateConfig = {
  id: 'counter',
  getInitialState: ({ initialValue }) => ({ index: initialValue }),
};

export default connectReduxUIState(config)(Counter);
```

## Roadmap
* Add existing state argument to getInitialState
* Add documentation for manual implementations
* Add plain JavaScript examples
