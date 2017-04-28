import React from 'react';
import renderer from 'react-test-renderer';
import Audio from '../Audio';

describe("Backend.Resource.Form.Audio component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Audio />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

