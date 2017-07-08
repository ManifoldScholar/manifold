import React from "react";
import Label from "../Label";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";

describe("Reader.Section.Label component", () => {
  const text = build.entity.text("1");
  text.attributes.published = false;
  text.relationships.category = build.entity.category("2");

  const root = <Label text={text} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
