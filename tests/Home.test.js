import { Component } from 'preact';
import Enzyme, { shallow } from 'enzyme';
import { Adapter } from 'enzyme-adapter-preact';

Enzyme.configure({ adapter: new Adapter() });

import Home '../src/routes/home';

describe('the Home component', () => {
  it('renders', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('h2')).toBeDefined();
  });
});
