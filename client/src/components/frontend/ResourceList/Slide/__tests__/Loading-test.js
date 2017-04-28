import React from 'react';
import renderer from 'react-test-renderer';
import Loading from '../Loading';
import build from 'test/fixtures/build';

describe("Frontend.ResourceList.Slide.Loading component", () => {

  const resource = build.entity.resource("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Loading
        resource={resource}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
