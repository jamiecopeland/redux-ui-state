import { DEFAULT_BRANCH_NAME } from './constants';

export function defaultUiBranchAccessor(state) {
  return state[DEFAULT_BRANCH_NAME];
}

export function defaultMapStateToProps(state) {
  console.log('wtf!');
  return { state };
}


export function defaultMapDispatchToProps(dispatch) {
  return { dispatch };
}

/**
 * [decorateMapStateToProps description]
 * @param  {Object} state       Redux store state
 * @param  {[type]} mappedState The global state state mapped to the state required by the
 *                              component
 * @return {[type]}             An object containing the custom mapped state and the global state
 */
export function decorateMapStateToProps(state, mappedState) {
  return { state, ...mappedState };
}
/**
 * Adds a dispatch property to the props
 * @param  {Function} dispatch     Redux store dispatch function
 * @param  {Object} mappedDispatch [description]
 * @return {Object} Object matching the custom mapped action creators and dispatch
 */
export function decorateMapDispatchToProps(dispatch, mappedDispatch) {
  return { dispatch, ...mappedDispatch };
}

export function omit(obj, keys) {
  const output = { ...obj };
  keys.forEach(key => delete output[key]);
  return output;
}
