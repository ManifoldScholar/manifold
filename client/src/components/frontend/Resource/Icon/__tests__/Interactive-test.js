import React from 'react';
import renderer from 'react-test-renderer';
import Interactive from '../Interactive';

describe("Frontend.Resource.Interactive component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Interactive />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

