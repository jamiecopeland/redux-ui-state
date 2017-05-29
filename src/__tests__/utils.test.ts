import { uiStateSelector, DefaultStateShape, UIStateBranch } from '../utils';

describe('utils', () => {

  const componentId = 'thing';
  const componentState = {
    isActive: true,
  };

  const defaultState: DefaultStateShape = {
    uiState: {
      components: {
        [componentId]: componentState,
      }
    }
  };

  interface CustomState {
    ui: UIStateBranch;
  }
  const customState: CustomState = {
    ui: {
      components: {
        [componentId]: componentState,
      }
    }
  };

  it('should select correctly when using default branch selector', () => {
    expect(uiStateSelector(defaultState, { id: componentId })).toEqual(componentState);
  });

  it('should select correctly when store state is Custom shape and using custom state selector', () => {
    const customStateSelector = ({ ui }: CustomState) => ui;

    expect(uiStateSelector(customState, { id: componentId, branchSelector: customStateSelector }))
      .toEqual(componentState);
  });

});