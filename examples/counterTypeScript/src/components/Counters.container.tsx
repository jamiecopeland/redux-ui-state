import { connectUIState, TransformPropsFunction } from 'redux-ui-state';

import {
  UIState,
  CounterProps,
  CounterDynamicIdProps,
  TransformedProps,
  CounterTransformedProps,
  CounterRawProps,
} from './Counters';

/**
 * Transforms the raw Redux UI State API into a nicer, more contextually relevant shape
 * @param uiState
 * @param setUIState
 * @param props
 */
const transformProps: TransformPropsFunction<UIState, CounterProps, TransformedProps> = (
  { uiState: { index } }, { setUIState }, { prefix }
) => ({
  message: `${prefix}${index}`,
  increment: () => setUIState({ index: index + 1 }),
  decrement: () => setUIState({ index: index - 1 }),
});

// Using connectUIState with transformed props (recommended) and a static id
export const CounterUtilTransformedPropsStaticId = connectUIState<UIState, CounterProps, TransformedProps>(
  'utilTransformedStatic', transformProps
)(CounterTransformedProps);

// Using connectUIState with transformed props (recommended) and a dynamic id
export const CounterUtilTranformedPropsDynamicId = connectUIState<UIState, CounterDynamicIdProps, TransformedProps>( // tslint:disable-line:max-line-length
  ({ uiStateId }) =>  uiStateId, transformProps
)(CounterTransformedProps);

// Using connectUIState with raw props and a static id
export const CounterUtilRawPropsStaticId = connectUIState<UIState, CounterProps>(
  'utilRawStatic'
)(CounterRawProps);

// Using connectUIState with raw props and a dynamic id
export const CounterUtilsRawPropsDynamicId = connectUIState<UIState, CounterDynamicIdProps>(
  ({ uiStateId }) => uiStateId
)(CounterRawProps);
