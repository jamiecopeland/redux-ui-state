import * as React from 'react';
import { Action, Store } from 'redux';

import {
  DefaultStoreState,
  UIStateBranch,
  defaultMapStateToProps,
  defaultMapDispatchToProps,
  createConnectWrapper,
} from '../utils';

describe('utils', () => {

  describe('defaultMapStateToProps', () => {
    const state: DefaultStoreState = {
      uiState: {
        components: {
          counter: {
            index: 0,
          }
        }
      }
    };
    expect(defaultMapStateToProps(state)).toEqual({ uiStateBranch: state.uiState });
  });

  describe('defaultMapDispatchToProps', () => {
    const dispatch = (action: Action) => action;
    expect(defaultMapDispatchToProps(dispatch)).toEqual({ dispatch });
  });

});
