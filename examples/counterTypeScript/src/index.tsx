import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import { Provider as ReduxUIStateProvider, defaultBranchSelector } from 'redux-ui-state';

import { AppState } from './state/index';
import App from './components/App';
import rootReducer from './reducers/index';

const store = createStore<AppState>(
  rootReducer, applyMiddleware(createLogger({ collapsed: true }))
);

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
