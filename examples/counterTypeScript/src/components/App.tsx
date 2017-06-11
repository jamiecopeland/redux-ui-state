import * as React from 'react';
import {  } from './Counters.container';

import {
  CounterUtilTransformedPropsStaticId,
  CounterUtilTranformedPropsDynamicId,
  CounterUtilRawPropsStaticId,
  CounterUtilsRawPropsDynamicId,
  CounterManualTransformedPropsStaticId,
  CounterManualTransformedPropsDynamicId,
  CounterManualRawPropsStaticId,
  CounterManualRawPropsDynamicId
} from './Counters.container';

class App extends React.Component<{}, void> {
  render() {
    return (
      <div>
        <h2>Standard Implementations</h2>

        <h3>Raw props, static id</h3>
        <CounterUtilRawPropsStaticId prefix="Value: " />

        <CounterUtilRawPropsStaticId prefix="Value: " />

        <hr />

        <h3>Raw props, dynamic id</h3>
        <CounterUtilsRawPropsDynamicId prefix="Value: " uiStateId="counterDynamicId1" />
        <CounterUtilsRawPropsDynamicId prefix="Value: " uiStateId="counterDynamicId2" />

        <hr />

        <h3>Transformed props, static id</h3>
        <CounterUtilTransformedPropsStaticId prefix="Value: " />
        <CounterUtilTransformedPropsStaticId prefix="Value: " />

        <hr />

        <h3>Transformed props, dynamic id</h3>
        <CounterUtilTranformedPropsDynamicId prefix="Value: " uiStateId="counterDynamicId3" />
        <CounterUtilTranformedPropsDynamicId prefix="Value: " uiStateId="counterDynamicId4" />

        <hr />

        <h2>Advanced Implementations</h2>

        <h3>Transformed props, static id</h3>

        <CounterManualTransformedPropsStaticId prefix="Value: " />
        <CounterManualTransformedPropsStaticId prefix="Value: " />

        <hr />

        <h3>Transformed props, dynamic id</h3>

        <CounterManualTransformedPropsDynamicId prefix="Value: " uiStateId="counterManualDynamicId1" />
        <CounterManualTransformedPropsDynamicId prefix="Value: " uiStateId="counterManualDynamicId2" />

        <hr />

        <h3>Raw props, static id</h3>

        <CounterManualRawPropsStaticId prefix="Value: " />
        <CounterManualRawPropsStaticId prefix="Value: " />

        <hr />

        <h3>Raw props, dynamic id</h3>

        <CounterManualRawPropsDynamicId prefix="Value: " uiStateId="counterManualDynamicId1" />
        <CounterManualRawPropsDynamicId prefix="Value: " uiStateId="counterManualDynamicId2" />

      </div>
    );
  }
}

export default App;
