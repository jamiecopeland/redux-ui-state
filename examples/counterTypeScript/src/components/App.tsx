import * as React from 'react';

import {
  CounterStatic, CounterDynamicInitialState, CounterDynamicId, CounterTransformed, CounterEverything
} from './01-Standard-Implementations';
import { CounterUtil, CounterManual } from './02-Advanced-Implementations' ;

class App extends React.Component<{}, void> {
  render() {
    return (
      <div>
        <h2>Standard Implementations</h2>

        <h3>Simple</h3>
        <CounterStatic />
        <CounterStatic />

        <hr />

        <h3>Dynamic initial state</h3>
        <CounterDynamicInitialState initialValue={0} />
        <CounterDynamicInitialState initialValue={1} />

        <hr />

        <h3>Dynamic id</h3>
        <CounterDynamicId uiStateId="dynamicId1" />
        <CounterDynamicId uiStateId="dynamicId2" />

        <hr />

        <h3>Transformed</h3>
        <CounterTransformed />

        <hr />

        <h3>Everything</h3>
        <CounterEverything uiStateId="counterEverythingA" initialValue={0} messagePrefix="Index A: " />
        <CounterEverything uiStateId="counterEverythingB" initialValue={0} messagePrefix="Index B: " />

        <hr />

        <h2>Advanced Implementations</h2>

        <h3>Connect with util</h3>
        <CounterUtil initialValue={0} />

        <hr />

        <h3>Connect manually</h3>
        <CounterManual initialValue={0} />
      </div>
    );
  }
}

export default App;
