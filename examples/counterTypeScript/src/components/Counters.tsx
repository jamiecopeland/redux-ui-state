import * as React from 'react';

import { Props as ReduxUIStateProps, } from 'redux-ui-state';

export interface UIState {
  index: number;
}

export interface CounterProps {
  prefix: string;
}

export interface CounterDynamicIdProps extends CounterProps {
  uiStateId: string;
}

// -------------------------------------------------------------------------------------------------
// Component accepting transformed props
// This implementation is clearly the better of the two, since it has a cleaner, more contextually relevant API.
// See Counters.containers.tsx for several example implentations of how to transform props

export interface TransformedProps {
  message: string;
  increment: () => void;
  decrement: () => void;
}

export const CounterTransformedProps: React.StatelessComponent<TransformedProps> = (
  { message, increment, decrement }
) => (
  <div>
    <div>
      {message}
    </div>
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  </div>
);

// -------------------------------------------------------------------------------------------------
// Component acccepting raw props
// This style of component still works, but the use of raw props necessitates extra, contextually irrelevant knowledge
// of the inner workings of Redux UI State's API.
// See Counters.containers.tsx for several example implentations of how to transform props

export const CounterRawProps: React.StatelessComponent<CounterProps & ReduxUIStateProps<UIState>> = ({
  prefix, uiState, setUIState
}) => (
  <div>
    <div>
      {prefix}{uiState.index}
    </div>
    <div>
      <button onClick={() => setUIState({ index: uiState.index - 1 })}>-</button>
      <button onClick={() => setUIState({ index: uiState.index + 1 })}>+</button>
    </div>
  </div>
);
