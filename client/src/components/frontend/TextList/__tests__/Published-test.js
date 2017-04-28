import React from 'react';
import renderer from 'react-test-renderer';
import Published from '../Published';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Frontend.TextList.Published component", () => {

  const text = build.entity.text("1");

  it('renders correctly', () => {
    const component = renderer.create(
      wrapWithRouter(
        <Published
          text={text}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
