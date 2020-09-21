import { shallow } from 'enzyme';
import React from 'react';
import CartDropdown from './cart-dropdown.component';

it('expect to render CartDropdown component', () => {
  expect(shallow(<CartDropdown />)).toMatchSnapshot();
})