import { connect } from 'react-redux';

import { UI_STATE_BRANCH_NAME } from './constants';

export const defaultUiBranchSelector = state => state[UI_STATE_BRANCH_NAME];

export const defaultMapDispatchToProps = dispatch => ({ dispatch });

export const defaultMapStateToProps = state => ({ uiStateBranch: defaultUiBranchSelector(state) });

export const createConnectWrapper = (
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) => component =>
  connect(mapStateToProps, mapDispatchToProps)(component);
