import React from 'react';
import renderer from 'react-test-renderer';
import BackLinkPrimary from '../BackLinkPrimary';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Frontend.Utility.BackLinkPrimary component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      wrapWithRouter(
        <BackLinkPrimary
          link="test/link"
          title="test"
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
