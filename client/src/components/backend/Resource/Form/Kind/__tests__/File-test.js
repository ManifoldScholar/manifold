import React from 'react';
import renderer from 'react-test-renderer';
import File from '../File';

describe("Backend.Resource.Form.File component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <File />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

