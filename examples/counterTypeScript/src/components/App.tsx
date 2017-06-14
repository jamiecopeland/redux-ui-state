import * as React from 'react';
import {  } from './Counters.container';

import {
  CounterUtilTransformedPropsStaticId,
  CounterUtilTranformedPropsDynamicId,
  CounterUtilRawPropsStaticId,
  CounterUtilsRawPropsDynamicId,
} from './Counters.container';

import {
  utilTransformedDynamic1,
  utilTransformedDynamic2,
  utilRawDynamic1,
  utilRawDynamic2,
} from '../uiState';

class App extends React.Component<{}, void> {
  render() {
    return (
      <div>
        <h2>Standard Implementations</h2>

        <h3>Transformed props, static id</h3>
        <CounterUtilTransformedPropsStaticId prefix="Value: " />
        <CounterUtilTransformedPropsStaticId prefix="Value: " />

        <hr />

        <h3>Transformed props, dynamic id</h3>
        <CounterUtilTranformedPropsDynamicId prefix="Value: " uiStateId={utilTransformedDynamic1.key} />
        <CounterUtilTranformedPropsDynamicId prefix="Value: " uiStateId={utilTransformedDynamic2.key} />

        <hr />

        <h3>Raw props, static id</h3>
        <CounterUtilRawPropsStaticId prefix="Value: " />
        <CounterUtilRawPropsStaticId prefix="Value: " />

        <hr />

        <h3>Raw props, dynamic id</h3>
        <CounterUtilsRawPropsDynamicId prefix="Value: " uiStateId={utilRawDynamic1.key} />
        <CounterUtilsRawPropsDynamicId prefix="Value: " uiStateId={utilRawDynamic2.key} />

        <hr />

      </div>
    );
  }
}

export default App;
