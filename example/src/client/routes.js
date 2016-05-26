import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Root from './components/screens/root/Root';
import NotFound from './components/screens/notFound/NotFound';

export function createRoutes(store) {
  const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: (state) => state.get('routing'),
  });

  return (
    <Router history={history}>
      <Route path="/" component={Root}>
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  );
}
