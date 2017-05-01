import * as React from 'react';

import CounterStatic from './CounterStatic';
import CounterDynamicInitialState from './CounterDynamicInitialState';
import CounterDynamicId from './CounterDynamicId';

const App: React.StatelessComponent<{}> = () => (
  <div>
    <h2>Simple</h2>
    <CounterStatic />
    <CounterStatic />

    <h2>Dynamic initial state</h2>
    <CounterDynamicInitialState initialValue={123} />
    <CounterDynamicInitialState initialValue={456} />

    <h2>Dynamic id (and initial state)</h2>
    <CounterDynamicId reduxUIStateId="dynamicId1" initialValue={123} />
    <CounterDynamicId reduxUIStateId="dynamicId2" initialValue={456} />
  </div>
);

export default App;
