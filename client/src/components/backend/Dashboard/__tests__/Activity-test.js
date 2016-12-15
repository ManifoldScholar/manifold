import React from 'react';
import renderer from 'react-test-renderer';
import { Dashboard } from 'components/backend';

describe("Dashboard.Activity component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Dashboard.Activity />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

