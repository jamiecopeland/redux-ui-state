import * as React from 'react';
import { Store } from 'redux';

import { UIStateBranch } from './addReduxUIState';
import { contextTypes } from './utils';

export interface ProviderProps<TState> {
  children?: JSX.Element;
  store: Store<TState>;
  branchSelector: (state: TState) => UIStateBranch;
}

export function createProvider<TState>(): React.ComponentClass<ProviderProps<TState>> {
  return class Provider extends React.Component<ProviderProps<TState>, void> {

    public static childContextTypes: object = contextTypes;

    getChildContext = () => ({
      reduxUIState: {
        store: this.props.store,
        branchSelector: this.props.branchSelector,
      },
    })

    render() {
      return this.props.children;
    };
  };
}

export const Provider = createProvider<object>();
