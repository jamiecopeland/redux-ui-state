import { connect } from 'react-redux';

import { DEFAULT_BRANCH_NAME } from './constants';

export const defaultUiBranchSelector = state => state[DEFAULT_BRANCH_NAME];

export const defaultMapDispatchToProps = dispatch => ({ dispatch });

export const defaultMapStateToProps = state => ({ uiStateBranch: defaultUiBranchSelector(state) });

export const createConnectWrapper = (
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) => component => connect(mapStateToProps, mapDispatchToProps)(component);
