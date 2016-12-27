import React from 'react';
import renderer from 'react-test-renderer';
import { Navigation } from 'components/backend';

describe("Navigation.Breadcrumb component", () => {

  const items = [
    {
      path: '/link-1',
      label: 'Link One'
    },
    {
      path: '/link-2',
      label: 'Link Two'
    }
  ]

  it('renders correctly', () => {
    const component = renderer.create(
      <Navigation.Breadcrumb breadcrumb={items} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

