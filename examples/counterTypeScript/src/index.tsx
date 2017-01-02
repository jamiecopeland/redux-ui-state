  import * as React from 'react';
  import * as ReactDOM from 'react-dom';
  import { createStore, applyMiddleware } from 'redux';
  import { Provider } from 'react-redux';
  import * as createLogger from 'redux-logger';

  import rootReducer from './reducers/index';
  import CounterAutoConnect from './components/CounterAutoConnect';
  import CounterUtilConnect from './components/CounterUtilConnect';
  import CounterManualConnect from './components/CounterManualConnect';

  const store = createStore(rootReducer, {}, applyMiddleware(createLogger({ collapsed: true })));
  const rootEl = document.getElementById('root');

  function render() {
    ReactDOM.render(
      <Provider store={store}>
        <div>

          {/*

          */}

          <h1>Connect automatically</h1>
          <CounterAutoConnect initialValue={1} />

          <h1>Connect using utility</h1>
          <CounterUtilConnect initialValue={2} />

          <h1>Connect manually</h1>
          <CounterManualConnect initialValue={3} />

        </div>
      </Provider>,
      rootEl
    );
  }

  render();
