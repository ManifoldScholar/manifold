import React from 'react';
import renderer from 'react-test-renderer';
import Video from '../Video';

describe("Frontend.Resource.Video component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Video />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

