# Redux UI State

[![version](https://img.shields.io/npm/v/redux-ui-state.svg)](https://npmjs.com/package/redux-ui-state)
[![licence](https://img.shields.io/github/license/jamiecopeland/redux-ui-state.svg)](https://github.com/jamiecopeland/redux-ui-state/blob/master/LICENSE.md)
![build](https://img.shields.io/travis/jamiecopeland/redux-ui-state.svg)
![gzip size](http://img.badgesize.io/https://unpkg.com/redux-ui-state/dist/redux-ui-state.min.js?compression=gzip&label=size%20gzipped)
![size](http://img.badgesize.io/https://unpkg.com/redux-ui-state/dist/redux-ui-state.min.js?label=size%20ungzipped)
[![downloads](https://img.shields.io/npm/dm/redux-ui-state.svg)](https://npmjs.com/package/redux-ui-state)


UI state management for Redux applications.

Makes storing UI state in the Redux store and sharing it between components simple, safe and transparent.

*WARNING: This should only be used for storing small amounts of UI data. Almost all of your application's data should be managed using standard reducers.*

## Installation

```
npm install redux-ui-state
```

Redux UI State is written in TypeScript, so the typings are automatically included and always up to date 🎉

## Getting started

NOTE: This is a simple implementation. For more complex implementations (e.g. custom Redux state shape and a dynamic config id), see the [example](https://github.com/jamiecopeland/redux-ui-state/tree/master/examples) folder.

### 1. Create the reducer for your app:

Your root reducer should look this:

```typescript
// rootReducer.js

import { combineReducers } from 'redux';
import { createReducer, DEFAULT_BRANCH_NAME } from 'redux-ui-state';

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

Use the `connectUIState` higher order component to inject `uiState` (to be used in place of `this.state`) and
`setUIState` (to be used in place of `this.setState`) into your component.

```typescript
// Counter.js
import React from 'react';
import { defaultConnectUIState as connectUIState } from 'redux-ui-state';

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

export default connectUIState(
  'counter',
  ({ index }, { setUIState }, { prefix }) = ({
    indexMessage: `${prefix}${index}`,
    decrement: () => setUIState({ index: index - 1 }),
    increment: () => setUIState({ index: index + 1 }),
  })
)(Counter);

// App.js
import React from 'react';
import Counter from './Counter';

const App = () => (
  <div>
    <Counter prefix="Value: " initialIndex={0} />
  </div>
);

```

## Rationale

### Shorter practical answer 🔨

Sharing UI state between components usually means either:
- Adding state to a parent component that shouldn't really be concerned with it and passing it through view layers that also shouldn't be concerned with it.
- Creating a custom UI state reducer with specific actions for each atom of state that will change.

Redux UI State replaces these overly complex, error prone solutions with a reducer and a higher order component that provides clean access to UI state held in the Redux store.

### Longer theoretical answer 🤓

#### Single state atom
Redux is a predictable, easy to undertand state container primarly because it has a single state object. This allows developers to inspect the entire state of an application at any given time and create powerful dev tools that enable magical things like time travel debugging. Keeping everything in one place is a large part of what drove Redux to win out over the traditional multi store Flux architecture yet most React applications let multiple data stores in through the back door by using `this.setState` in components.

As soon as this happens the single state atom principle breaks down, the entire application state cannot be inspected and full state serialization / time travel debugging becomes impossible.

#### Sharing state with siblings

Sibling components sometimes need to share their UI state. This can be achieved by moving that state up into the parent component, but this is often not something the parent should be concerned with, which means increased complexity, confusing APIs, less reusability and the system as a whole being more prone to errors.

#### Sharing state with children

In situations where it does make sense for a parent to hold a piece of UI state, that data may be needed several layers down in the view hierarchy, meaning intermediate components, unconcerned with the data in question, need to include it in their APIs, again creating unnecessary complexity, which results in confusing APIs and a greater likelihood of errors cropping up.

### A solution

Redux UI State replaces these overly complex, error prone solutions with a higher order component that provides clean access to UI state held in the Redux store.

## TODO / Roadmap
* Add Github pages page
* Add documentation for advanced implementations
* Add plain JavaScript examples
* Add flow type definitions

