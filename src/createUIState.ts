import * as React from 'react';
import { connect } from 'react-redux';

import {
  DefaultStoreState,
  uiStateSelector,
  setUIStateSelector,
  defaultUIStateBranchSelector,
  Props,
  StateProps,
  DispatchProps,
  UIStateBranchSelector,
  UIStateIdProps,
} from './utils';

// Added temporary fix for issue related to https://github.com/Microsoft/TypeScript/issues/9944
// error TS4076: Parameter 'uiStateBranchSelector' of exported function has or is using name
// 'UIStateBranchSelector' from external module "[...]/redux-ui-state/src/utils" but cannot be named
// tslint:disable-next-line:class-name
export interface __IMPORT_FIX {
  UIStateBranchSelector: UIStateBranchSelector<{}>;
  StateProps: StateProps<{}>;
  DispatchProps: DispatchProps<{}>;
}

export interface UIStateComponentProps<TUIState> {
  // tslint:disable-next-line:no-any
  children: (props: Props<TUIState>) => React.ReactElement<any> | null;
}

export interface UIStateComponentPropsMapped<TMappedProps> {
  // tslint:disable-next-line:no-any
  children: (props: TMappedProps) => React.ReactElement<any> | null;
}

export type Mapper<TUIState, TMappedProps> = (props: Props<TUIState>) => TMappedProps

export const defaultMapper = <TUIState>(props: Props<TUIState>) => props;

export const setupCreateUIState = <TAppState = DefaultStoreState>(
  uiStateBranchSelector = defaultUIStateBranchSelector
) => <TUIState, TMappedProps = Props<TUIState>>(
  id: string,
  mapper?: Mapper<TUIState, TMappedProps>,
) => connect(
  (state: TAppState, props: UIStateComponentPropsMapped<TMappedProps>) => ({
    uiState: uiStateSelector(state, {
      uiStateId: id,
      uiStateBranchSelector,
      ...props,
    }) as TUIState,
  }),
  (dispatch) => ({
    setUIState: setUIStateSelector<TUIState, UIStateIdProps<{}>>(dispatch, { uiStateId: id }),
  }),
  // Using Object.assign here to avoid "Spread types may only be created from object types"
  // https://github.com/Microsoft/TypeScript/issues/10727
  (stateProps, dispatchProps, ownProps) => Object.assign(
    {},
    ownProps,
    mapper
      ? mapper({...stateProps, ...dispatchProps})
      : defaultMapper<TUIState>({...stateProps, ...dispatchProps})
  )
)((props) => {
  // Until TypeScript allows spread on interfaces, force props to any to allow ES7 rest syntax
  // https://github.com/Microsoft/TypeScript/issues/16780
  // tslint:disable-next-line:no-any
  const { children, ...rest } = props as any;
  return children(rest)
});
