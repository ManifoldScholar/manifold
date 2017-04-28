import React from 'react';
import renderer from 'react-test-renderer';
import Audio from '../Audio';

describe("Frontend.Resource.Audio component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Audio />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

