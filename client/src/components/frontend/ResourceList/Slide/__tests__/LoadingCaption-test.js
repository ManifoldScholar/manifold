import React from 'react';
import renderer from 'react-test-renderer';
import LoadingCaption from '../LoadingCaption';

describe("Frontend.ResourceList.Slide.LoadingCaption component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <LoadingCaption />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
