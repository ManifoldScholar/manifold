import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Avatar from '../Avatar';

describe("Global.Avatar component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Avatar
        url="some/url"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders a placeholder when no url specified', () => {
    const component = shallow(
      <Avatar />
    );
    expect(component.find('i')).toHaveLength(1);
  });

});

