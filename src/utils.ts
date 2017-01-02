import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { DEFAULT_BRANCH_NAME } from './constants';

export const defaultUiBranchSelector = (state: any) => state[DEFAULT_BRANCH_NAME];

export const defaultMapStateToProps = (state: any, ownProps: Object) => ({
  uiStateBranch: defaultUiBranchSelector(state),
  ownProps
});

export const defaultMapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

export const createConnectWrapper = <P>(
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) => (component: React.ComponentClass<any>) => connect<any, any, P>(mapStateToProps, mapDispatchToProps)(component);

export const merge = (obj1: Object, obj2: Object) => Object.assign({}, obj1, obj2);
