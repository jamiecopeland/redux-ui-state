import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers/index';
import App from './components/App';

const store = createStore(rootReducer, {}, applyMiddleware(createLogger({ collapsed: true })));
const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootEl
  );
}

render();
