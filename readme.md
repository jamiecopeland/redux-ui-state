# Redux UI State

## What?

UI state management for Redux applications.

Makes storing UI state in the Redux store and sharing it between components simple, safe and transparent.

## Why?

### Shorter practical answer 🔨

Sharing UI state between components usually means either:

Sharing UI state between components usually means either:
- Adding state to a parent that shouldn't really be concerned with it and passing it through view layers that also shouldn't be concerned with it.
- Creating a custom UI state reducer with custom actions for each atom of state that needs to be changed.

Redux UI State replaces these overly complex, error prone solutions with a higher order component that provides clean access to UI state held in the Redux store.

### Longer theoretical answer 🤓

#### Single state atom
Redux is a predictable, easy to undertand state container primarly because it has a single state object. This allows developers to inspect
the entire state of an application at any given time and do magical things like time travel debugging. Keeping
everything in one place is a large part of what drove Redux to win out over the traditional multi store Flux architecture(s) yet most
React applications let multiple data stores in through the back door by using `this.setState` in components.

As soon as this happens the single state atom principle breaks down - the entire application state cannot be inspected and
full time travel debugging becomes impossible.

#### Sharing state with siblings

Siblings components sometimes need to share their UI state. This can be achieved through moving that state up into the parent component, but this is often not something the parent should be concerned with, creating confusing APIs.

#### Sharing state with children

In situations where it does make sense for a parent to hold a piece of UI state, that data may be needed several layers down in the view hierarchy, meaning intermediate components, unconcerned with the data in question need to include it in their APIs, making them both confusing and less reusable.

### A solution

Redux UI State replaces these overly complex, error prone solutions with a higher order component that provides clean access to UI state held in the Redux store.

## Installation

```
npm install redux-ui-state
```

Redux UI State is written in TypeScript, so the typings are automatically included and always up to date 🎉

## Getting started

NOTE: This is a simple implementation. For more complex implementations (e.g. custom Redux state shape and a dynamic config id), see the examples folder.

### 1. Create the reducer for your app:

Your root reducer should look this:

```
// rootReducer.js

import { combineReducers } from 'redux';
import { pojoReducer, DEFAULT_BRANCH_NAME } from 'redux-ui-state';

const initialState = {
  counter: {
    index: 0
  },
}

export default combineReducers({
  ...
  [DEFAULT_BRANCH_NAME]: createReducer(initialState),
  ...
});
```

### 2. Create a component:

Use the `connectReduxUIState` higher order component to inject `uiState` (to be used in place of `this.state`) and
`setUIState` (to be used in place of `this.setState`) into your component.

```
// Counter.js

import React from 'react';

const Counter = ({ indexMessage, increment, decrement }) => (
  <div>
    <div>
      {indexMessage}
    </div>
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  </div>
);

export default connectReduxUIState(
  'counter',
  ({ index }, { setUIState }, { message }) = ({
    indexMessage: `${message}${index}`,
    decrement: () => setUIState({ index: index - 1 }),
    increment: () => setUIState({ index: index + 1 }),
  })
)(Counter);

// App.js
import React from 'react';
import Counter from './Counter';

const App = () => (
  <div>
    <Counter initialIndex={0} message="Value: " />
  </div>
);

```

## Roadmap
* Add documentation for advanced implementations
* Add plain JavaScript examples
