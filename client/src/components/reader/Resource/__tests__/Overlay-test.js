import React from 'react';
import Overlay from '../Overlay';
import renderer from 'react-test-renderer';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Reader.Resource.Overlay component", () => {

  const resource = build.entity.resource("1");
  resource.relationships.project = build.entity.project("2");

  const root = (
    wrapWithRouter(
      <Overlay
        resource={resource}
      />
    )
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
