import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers/index';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const store = createStore(rootReducer, {}, applyMiddleware(createLogger({ collapsed: true })));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
