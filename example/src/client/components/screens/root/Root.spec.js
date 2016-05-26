import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Root from './Root';

describe('Root', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Root />);
  });

  it('should have correct style class applied', () => {
    expect(wrapper.find('.Root')).to.have.length(1);
  });
});
