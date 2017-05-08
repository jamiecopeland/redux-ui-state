import * as React from 'react';

import { CounterStatic, CounterDynamicInitialState, CounterDynamicId } from './Counters';

class App extends React.Component<{}, void> {
  render() {
    return (
      <div>
        <h2>Simple</h2>
        <CounterStatic />
        <CounterStatic />

        <h2>Dynamic initial state</h2>
        <CounterDynamicInitialState initialValue={0} />
        <CounterDynamicInitialState initialValue={1} />

        <h2>Dynamic id</h2>
        <CounterDynamicId uiStateId="dynamicId1" />
        <CounterDynamicId uiStateId="dynamicId2" />
      </div>
    );
  }
}

export default App;
