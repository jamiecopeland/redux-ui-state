import * as React from 'react';

import {
  CounterRawPropsStaticId,
  CounterTranformedPropsStaticId,
  CounterRawPropsDynamicId,
  CounterTranformedPropsDynamicId
} from './01-Standard-Implementations';

import { CounterManualStaticId, CounterManualDynamicId } from './02-Advanced-Implementations';

class App extends React.Component<{}, void> {
  render() {
    return (
      <div>
        <h2>Standard Implementations</h2>

        <h3>Raw props, static id</h3>
        <CounterRawPropsStaticId prefix="Value: " />
        <CounterRawPropsStaticId prefix="Value: " />

        <hr />

        <h3>Raw props, dynamic id</h3>
        <CounterRawPropsDynamicId prefix="Value: " uiStateId="counterDynamicId1" />
        <CounterRawPropsDynamicId prefix="Value: " uiStateId="counterDynamicId2" />

        <hr />

        <h3>Transformed props, static id</h3>
        <CounterTranformedPropsStaticId prefix="Value: " />
        <CounterTranformedPropsStaticId prefix="Value: " />

        <hr />

        <h3>Transformed props, dynamic id</h3>
        <CounterTranformedPropsDynamicId prefix="Value: " uiStateId="counterDynamicId3" />
        <CounterTranformedPropsDynamicId prefix="Value: " uiStateId="counterDynamicId4" />

        <hr />

        <h2>Advanced Implementations</h2>

        <h3>Static id</h3>

        <CounterManualStaticId message="Value: " />
        <CounterManualStaticId message="Value: " />

        <hr />

        <h3>Dynamic id</h3>

        <CounterManualDynamicId message="Value: " uiStateId="counterManualDynamicId1" />
        <CounterManualDynamicId message="Value: " uiStateId="counterManualDynamicId2" />

      </div>
    );
  }
}

export default App;
