import React from 'react';
import Body from '../Body';
import renderer from 'react-test-renderer';
import build from 'test/fixtures/build';

describe("Reader.Section.Body component", () => {

  const section = build.entity.textSection("1");
  const annotations = [build.entity.annotation("2"), build.entity.annotation("3")];

  const root = (
    <Body
      section={section}
      annotations={annotations}
    />
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
