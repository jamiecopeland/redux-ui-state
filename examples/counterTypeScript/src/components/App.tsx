import * as React from 'react';

import { CounterStatic, CounterDynamicInitialState, CounterDynamicId, CounterTransformed, CounterEverything } from './Counters';

class App extends React.Component<{}, void> {
  render() {
    return (
      <div>
        <h2>Simple</h2>
        <CounterStatic />
        <CounterStatic />

        <hr />

        <h2>Dynamic initial state</h2>
        <CounterDynamicInitialState initialValue={0} />
        <CounterDynamicInitialState initialValue={1} />

        <hr />

        <h2>Dynamic id</h2>
        <CounterDynamicId uiStateId="dynamicId1" />
        <CounterDynamicId uiStateId="dynamicId2" />

        <hr />

        <h2>Transformed</h2>
        <CounterTransformed />

        <hr />

        <h2>Everything</h2>
        <CounterEverything uiStateId="counterEverythingA" initialValue={0} messagePrefix="Index A: " />
        <CounterEverything uiStateId="counterEverythingB" initialValue={0} messagePrefix="Index B: " />
      </div>
    );
  }
}

export default App;
