import React from 'react';
import renderer from 'react-test-renderer';
import Added from '../Added';
import build from 'test/fixtures/build'

const event = build.entity.event("1");

describe("Frontend.Event.Body.Added Component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Added
        event={event}
        icon="book-opening"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

