import React from 'react';
import renderer from 'react-test-renderer';
import Slide from '../Slide';
import build from 'test/fixtures/build';

describe("Frontend.ResourceList.Slide.Slide component", () => {

  const resource = build.entity.resource("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Slide
        resource={resource}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
