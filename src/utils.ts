import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { DEFAULT_BRANCH_NAME } from './constants';
import { UIStateBranch, DefaultStateShape, ExportedComponentStateProps, ExportedComponentDispatchProps, ExportedComponentProps } from './addReduxUIState';

export const defaultUiBranchSelector = (state: DefaultStateShape): UIStateBranch => state[DEFAULT_BRANCH_NAME];

export const defaultMapStateToProps = (state: DefaultStateShape, ownProps: Object): ExportedComponentStateProps => ({
  uiStateBranch: defaultUiBranchSelector(state),
  ownProps
});

export const defaultMapDispatchToProps = (dispatch: Dispatch<DefaultStateShape>) => ({ dispatch });

export const createConnectWrapper = <P>(
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) => (component: React.ComponentClass<ExportedComponentProps & P>) =>
  connect<
    ExportedComponentStateProps,
    ExportedComponentDispatchProps,
    P
  >(mapStateToProps, mapDispatchToProps)(component);

export const merge = (obj1: Object, obj2: Object) => Object.assign({}, obj1, obj2);
