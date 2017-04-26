import * as propTypes from 'prop-types';

import { DEFAULT_BRANCH_NAME } from './constants';
import { Store } from 'redux';
import {
  UIStateBranch,
  DefaultStateShape,
} from './addReduxUIState';

/**
 * Selects the default from the Redux store
 */
export const defaultBranchSelector = (state: DefaultStateShape): UIStateBranch => state[DEFAULT_BRANCH_NAME];

/**
 * The shape of the context supplied by the Provider
 */
export interface Context<TState> {
  reduxUIState: {
    store: Store<TState>;
    branchSelector: (state: TState) => UIStateBranch;
  };
}

/**
 * The context types required by React
 */
export const contextTypes = {
  reduxUIState: propTypes.shape({
    store: propTypes.object,
    branchSelector: propTypes.func,
  }),
};
