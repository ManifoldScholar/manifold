import React from 'react';
import renderer from 'react-test-renderer';
import Placeholder from '../Placeholder';

describe("Global.Text.Placeholder component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Placeholder />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

