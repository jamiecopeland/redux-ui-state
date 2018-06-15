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

/**
 * The props for UIState component with a generic for the values accepted by the render prop
 */
export interface UIStateComponentProps<TProps> {
  // tslint:disable-next-line:no-any
  children: (props: TProps) => React.ReactElement<any> | null;
}

/**
 * A function that maps StateProps<T> & DispatchProps<T> into the shape required by the render
 * prop function
 */
export type MapCreateUIStateProps<TUIState, TMappedProps> = (
  props: Props<TUIState>
) => TMappedProps;

/**
 * A render prop component factory responsible for injecting Redux UI State props into a render prop
 * component
 * @param uiStateBranchSelector A selector that selects the top level ui state branch from the
 * redux store with default if no argument is passed.
 */
export const setupCreateUIState = <TAppState = DefaultStoreState>(
  uiStateBranchSelector = defaultUIStateBranchSelector
) => <TUIState, TMappedProps = Props<TUIState>>(
  id: string,
  mapper?: MapCreateUIStateProps<TUIState, TMappedProps>,
) => connect(
  (state: TAppState, props: UIStateComponentProps<TMappedProps>) => ({
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
      : {...stateProps, ...dispatchProps}
  )
)((props) => {
  // Until TypeScript allows spread on interfaces, force props to any to allow ES7 rest syntax
  // https://github.com/Microsoft/TypeScript/issues/16780
  // tslint:disable-next-line:no-any
  const { children, ...rest } = props as any;
  return children(rest);
});
