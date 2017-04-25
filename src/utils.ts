import * as propTypes from 'prop-types';
import { createSelector } from 'reselect';

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
 * The shape of props passed into the idSelector
 */
export interface IdSelectorProps {
  id: string;
}

/**
 * Selects the id passed in by the props
 */
export const idSelector = (_: Object, { id }: IdSelectorProps) => id;

/**
 * The shape of the props passed into branchSelectorSelector
 */
export interface BranchSelectorSelectorProps {
  branchSelector: (state: Object) => UIStateBranch;
}

/**
 * Selects the uiStateBranchSelector from the props
 */
export const branchSelectorSelector = (
  _: Object, { branchSelector }: BranchSelectorSelectorProps
) =>
  branchSelector;

/**
 * Selects uiState of a component
 */
export const uiStateSelector = createSelector(
  state => state,
  idSelector,
  branchSelectorSelector,
  (state, id, branchSelector = defaultBranchSelector) => branchSelector(state).components[id],
);

export interface Context {
  reduxUIState: {
    store: Store<any>;
    branchSelector: (state: any) => UIStateBranch;
  };
}

export const contextTypes = {
  reduxUIState: propTypes.shape({
    store: propTypes.object,
    branchSelector: propTypes.func,
  }),
  // reduxUIState: React.PropTypes.object
};

export type AnyComponent<TProps, TState> = React.StatelessComponent<TProps>
  | (new() => React.Component<TProps, TState>)
  | (new() => React.PureComponent<TProps, TState>);
