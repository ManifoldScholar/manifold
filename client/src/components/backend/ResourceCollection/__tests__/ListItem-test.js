import React from 'react';
import renderer from 'react-test-renderer';
import ListItem from '../ListItem';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Backend.ResourceCollection.ListItem component", () => {

  const collection = build.entity.collection("1");

  it('renders correctly', () => {
    const component = renderer.create(
      wrapWithRouter(
        <ListItem
          entity={collection}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

