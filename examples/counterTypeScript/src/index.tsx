import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers/index';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

// interface WindowWithDevTools {
//   __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: string
// }

// tslint:disable-next-line:no-any
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  // tslint:disable-next-line:no-any
  ?  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // options like actionSanitizer, stateSanitizer
    })
  : compose;

const enhancer = composeEnhancers(
  applyMiddleware(createLogger({ collapsed: true })),
);

const store = createStore(rootReducer, {}, enhancer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
