import React from 'react';
import renderer from 'react-test-renderer';
import { Dashboard } from 'components/backend';

describe("Backend.Dashboard.Notification component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Dashboard.Notifications />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

