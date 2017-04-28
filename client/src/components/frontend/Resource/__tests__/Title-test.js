import React from 'react';
import renderer from 'react-test-renderer';
import Title from '../Title';
import build from 'test/fixtures/build';

describe("Frontend.Resource.Title component", () => {

  const resource = build.entity.resource("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Title
        resource={resource}
        showDate
        showIcon
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
