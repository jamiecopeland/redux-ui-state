import { connect } from 'react-redux';
import * as React from 'react';

import { DEFAULT_BRANCH_NAME } from './constants';
import { ComponentClass } from 'react';
import { StateProps } from './addReduxUIState';

export const defaultUiBranchSelector = state => state[DEFAULT_BRANCH_NAME];

export const defaultMapDispatchToProps = dispatch => ({ dispatch });

export const defaultMapStateToProps = (state, ownProps) => ({
  uiStateBranch: defaultUiBranchSelector(state),
  ownProps
});

export const createConnectWrapper = <P>(
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) => component => connect<any, any, P>(mapStateToProps, mapDispatchToProps)(component);

export const merge = (obj1, obj2) => Object.assign({}, obj1, obj2);
