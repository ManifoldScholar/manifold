import React from 'react';
import renderer from 'react-test-renderer';
import Secondary from '../Secondary';
import { shallow, mount, render } from 'enzyme';

describe("Navigation.Secondary component", () => {

  const links = [
    {
      path: '/link-1',
      label: 'Link One',
      key: "one"
    },
    {
      path: '/link-2',
      label: 'Link Two',
      key: "two"
    }
  ]

  it('renders correctly', () => {
    const component = renderer.create(
      <Secondary links={links} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });


  it('has the active state when specified', () => {
    const component = render(
      <Secondary links={links} active={'two'} />
    );
    expect(component.find('.active')).toHaveLength(1);
  });

  it('has no active state when not specified', () => {
    const component = render(
      <Secondary links={links} />
    );
    expect(component.find('.active')).toHaveLength(0);
  });

});

