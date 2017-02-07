import React from 'react';
import renderer from 'react-test-renderer';
import { Footer } from 'components/reader';

describe("Footer component", () => {

  const text = {
    attributes: {
      rights: "All rights reserved"
    }
  };

  it('renders correctly', () => {
    const component = renderer.create(
      <Footer text={text} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

