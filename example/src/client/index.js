import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

const initialState = {};
const store = configureStore(initialState);
const rootElement = document.getElementById('app-dom-hook');

const render = () => {
  // This needs to be required each time to ensure new modules are used for render
  const App = require('./components/App').default;
  ReactDOM.render(
    <Provider store={store}>
      <App store={store} />
    </Provider>,
    rootElement
  );
};

if (module.hot) {
  const renderError = (error) => {
    const RedBox = require('redbox-react');
    ReactDOM.render(
      <RedBox error={error} />,
      rootElement
    );
  };

  const rerender = () => {
    try {
      render();
    } catch (error) {
      renderError(error);
    }
  };

  module.hot.accept('./components/App', () => setTimeout(rerender));
}

render();
