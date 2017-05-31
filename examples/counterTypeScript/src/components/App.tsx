import * as React from 'react';

import {
  CounterStatic,
  CounterDynamicId,
  CounterTransformed,
} from './01-Standard-Implementations';
import {
  CounterUtil,
  CounterManual
} from './02-Advanced-Implementations' ;

class App extends React.Component<{}, void> {
  render() {
    return (
      <div>
        <h2>Standard Implementations</h2>

        <h3>Transformed</h3>
        <CounterTransformed message="Value: " />

        <hr />

        <h3>Simple</h3>
        <CounterStatic message="Value: " />
        <CounterStatic message="Value: " />

        <hr />

        <h3>Dynamic id</h3>
        <CounterDynamicId message="Value: " uiStateId="counterDynamicId1" />
        <CounterDynamicId message="Value: " uiStateId="counterDynamicId2" />

        <hr />

        <h2>Advanced Implementations</h2>

        <h3>Connect with util</h3>
        <CounterUtil message="Value: " />

        <hr />

        <h3>Connect manually</h3>
        <CounterManual message="Value: " />

      </div>
    );
  }
}

export default App;
