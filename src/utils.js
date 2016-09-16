import { connect } from 'react-redux';

import { UI_STATE_BRANCH_NAME } from './constants';

export function defaultUiBranchSelector(state) {
  return state[UI_STATE_BRANCH_NAME];
}

export function defaultMapStateToProps(state) {
  return { state };
}


export function defaultMapDispatchToProps(dispatch) {
  return { dispatch };
}

/**
 * Adds a state property to the props.
 * @param  {Object} state       The global state.
 * @param  {[type]} mappedState The global state state mapped to the state required by the
 *                              component.
 * @return {[type]}             An object containing the custom mapped state and the global state.
 */
export function decorateMapStateToProps(state, mappedState) {
  return { state, ...mappedState };
}
/**
 * Adds a dispatch property to the props.
 * @param  {Function} dispatch     Redux store dispatch function.
 * @param  {Object} mappedDispatch [description].
 * @return {Object} Object matching the custom mapped action creators and dispatch.
 */
export function decorateMapDispatchToProps(dispatch, mappedDispatch) {
  return { dispatch, ...mappedDispatch };
}

/**
 * Omits keys from an object.
 * @param  {Object} obj  The source object.
 * @param  {Array} keys The property identifiers to be omitted.
 * @return {Object} A shallow clone of the original object with the specified keys removed.
 */
export function omit(obj, keys) {
  const output = { ...obj };
  keys.forEach(key => delete output[key]);
  return output;
}

export const createConnectWrapper = (
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) => component =>
  connect(mapStateToProps, mapDispatchToProps)(component);
