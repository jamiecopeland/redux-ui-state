import {
  defaultConnectUIState as connectUIState,
  MapConnectUIStateProps,
} from 'redux-ui-state';

import {
  UIState,
  CounterProps,
  CounterDynamicIdProps,
  MappedProps,
  CounterTransformedProps,
  CounterRawProps,
} from './Counters';

/**
 * Maps the raw Redux UI State API into a nicer, more contextually relevant shape
 * @param uiState
 * @param setUIState
 * @param props
 */
const mappedProps: MapConnectUIStateProps<
  UIState,
  MappedProps,
  CounterProps
> = (uiProps, ownProps) => ({
  message: `${ownProps.prefix}${uiProps.uiState.index}`,
  increment: () => uiProps.setUIState({ index: uiProps.uiState.index + 1 }),
  decrement: () => uiProps.setUIState({ index: uiProps.uiState.index - 1 }),
});

// Using connectUIState with mapped props (recommended) and a static id
export const CounterUtilTransformedPropsStaticId = connectUIState<
  UIState,
  CounterProps,
  MappedProps
>('utilTransformedStatic', mappedProps)(CounterTransformedProps);

// Using connectUIState with mapped props (recommended) and a dynamic id
export const CounterUtilTranformedPropsDynamicId = connectUIState<
  UIState,
  CounterDynamicIdProps,
  MappedProps
>(({ uiStateId }) => uiStateId, mappedProps)(CounterTransformedProps); // tslint:disable-line:max-line-length

// Using connectUIState with raw props and a static id
export const CounterUtilRawPropsStaticId = connectUIState<
  UIState,
  CounterProps
>('utilRawStatic')(CounterRawProps);

// Using connectUIState with raw props and a dynamic id
export const CounterUtilsRawPropsDynamicId = connectUIState<
  UIState,
  CounterDynamicIdProps
>(({ uiStateId }) => uiStateId)(CounterRawProps);
