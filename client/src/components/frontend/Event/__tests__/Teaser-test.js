import React from 'react';
import renderer from 'react-test-renderer';
import Teaser from '../Teaser';
import build from 'test/fixtures/build'

const event = build.entity.event("1");

describe("Frontend.Event.Teaser Component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Teaser
        event={event}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

