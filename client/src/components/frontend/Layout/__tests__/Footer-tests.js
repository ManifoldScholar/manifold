import React from 'react';
import renderer from 'react-test-renderer';
import { Layout } from 'components/frontend';

describe("Footer component", () => {

  const settings = {
    attributes: {
      general: {
        contactUrl: "http://www.test.com"
      }
    }
  };

  it('renders correctly', () => {
    const component = renderer.create(
      <Layout.Footer
        authentication={{ authenticated: false }}
        settings={settings}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

