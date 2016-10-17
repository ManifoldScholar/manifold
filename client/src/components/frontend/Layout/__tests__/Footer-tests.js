import React from 'react';
import renderer from 'react-test-renderer';
import { Layout } from 'components/frontend';

describe("Footer component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Layout.Footer authentication={{ authenticated: false } } />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

