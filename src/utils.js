import { DEFAULT_BRANCH_NAME } from './constants';

export function defaultUiBranchAccessor(state) {
  return state[DEFAULT_BRANCH_NAME];
}
