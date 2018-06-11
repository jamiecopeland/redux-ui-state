import * as React from 'react';

import { setupCreateUIState } from 'redux-ui-state/lib/createUIState';

import {
  CounterUtilTransformedPropsStaticId,
  CounterUtilTranformedPropsDynamicId,
  CounterUtilRawPropsStaticId,
  CounterUtilsRawPropsDynamicId,
} from './Counters.container';

import {
  renderPropUnmapped,
  renderPropMapped,
  utilTransformedDynamic1,
  utilTransformedDynamic2,
  utilRawDynamic1,
  utilRawDynamic2,
} from '../uiState';

interface UIState {
  index: number;
}

export interface TransformedProps {
  index: number;
  increment: () => void;
  decrement: () => void;
}

const createUIState = setupCreateUIState();

export const UIStateUnmapped = createUIState<UIState>(renderPropUnmapped.key);
export const UIStateMapped = createUIState<UIState, TransformedProps>(
  renderPropMapped.key,
  ({ uiState, setUIState }) => ({
    index: uiState.index,
    increment: () => setUIState({ index: uiState.index + 1 }),
    decrement: () => setUIState({ index: uiState.index - 1 })
  })
);

class App extends React.Component<{}, {}> {
  
  increment = () => {
    this.setState({});
  }

  render() {
    return (
      <div>
        <h2>Render Prop Implementations</h2>
        <h3>Unmapped render props</h3>
        <UIStateUnmapped>
          {({ uiState: { index }, setUIState }) => (
            <div>
              <div>Value: {index}</div>
              <div>
                <button onClick={() => setUIState({ index: index - 1})}>-</button>
                <button onClick={() => setUIState({ index: index + 1})}>+</button> 
              </div>
            </div>
          )}
        </UIStateUnmapped>
        <hr />
        <h3>Unmapped render props</h3>
        <UIStateMapped>
          {({ index, increment, decrement }) => (
            <div>
              <div>Value: {index}</div>
              <div>
                <button onClick={decrement}>-</button>
                <button onClick={increment}>+</button>
              </div>
            </div>
          )}
        </UIStateMapped>
        <hr />
        <h2>Higher Order Component Implementations</h2>
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
