import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import { createProvider, defaultBranchSelector, DefaultStateShape } from 'redux-ui-state';

import rootReducer from './reducers/index';
import Counter from './components/Counter';

const store = createStore<DefaultStateShape>(
  rootReducer, applyMiddleware(createLogger({ collapsed: true }))
);
const rootEl = document.getElementById('root');

setTimeout(() => store.dispatch({type: 'asdf'}), 1000);
setTimeout(() => store.dispatch({type: 'asdf'}), 1500);

const ReduxUIStateProvider = createProvider<DefaultStateShape>();

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <ReduxUIStateProvider
        store={store}
        branchSelector={defaultBranchSelector}
      >
        <Counter initialValue={234} />
      </ReduxUIStateProvider>
    </Provider>,
    rootEl
  );
}

render();
