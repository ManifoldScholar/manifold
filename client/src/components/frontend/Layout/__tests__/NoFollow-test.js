import React from 'react';
import renderer from 'react-test-renderer';
import NoFollow from '../NoFollow';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Frontend.Layout.NoFollow component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      wrapWithRouter(
        <NoFollow />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

