import React from 'react';
import renderer from 'react-test-renderer';
import { Footer } from 'components/reader';

describe("Reader.Footer component", () => {

  const text = {
    attributes: {
      rights: "All rights reserved"
    }
  };

  const text_multiline = {
    attributes: {
      rights: `line one
      line two`
    }
  };

  it('renders correctly', () => {
    const component = renderer.create(
      <Footer text={text} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('adds a line break between lines', () => {
    const component = renderer.create(
      <Footer text={text_multiline} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });



});

