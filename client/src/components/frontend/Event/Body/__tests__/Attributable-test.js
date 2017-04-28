import React from 'react';
import renderer from 'react-test-renderer';
import Attributable from '../Attributable';
import build from 'test/fixtures/build'

const event = build.entity.tweetEvent("1");

describe("Frontend.Event.Body.Attributable Component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Attributable
        event={event}
        icon="book-opening"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

