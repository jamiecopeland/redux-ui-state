import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { DEFAULT_BRANCH_NAME } from './constants';
import {
  UIStateBranch,
  DefaultStateShape,
  ExportedComponentStateProps,
  ExportedComponentDispatchProps,
  ExportedComponentProps
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

/**
 * Maps uiStateBranch to props if the default state shape for the Redux store has been used
 */
export const defaultMapStateToProps = (state: DefaultStateShape): ExportedComponentStateProps => ({
  uiStateBranch: defaultBranchSelector(state),
});

/**
 * Maps dispatch to props.
 * NOTE: This will not vary based on state shape
 */
export const defaultMapDispatchToProps = (dispatch: Dispatch<Object>) => ({
  dispatch,
});

/**
 * Creates a connect wrapper for the addReduxUIState higher order component. If custom mappers are not specified,
 * defaults will be used.
 */
export const createConnectWrapper = <TProps>(
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) => (component: React.ComponentClass<ExportedComponentProps & TProps>) =>
  connect<
    ExportedComponentStateProps,
    ExportedComponentDispatchProps,
    TProps
  >(mapStateToProps, mapDispatchToProps)(component);
