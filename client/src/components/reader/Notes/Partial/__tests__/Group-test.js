import React from "react";
import renderer from "react-test-renderer";
import Group from "../Group";
import build from "test/fixtures/build";

describe("Reader.Notes.Partial.Group Component", () => {
  const annotations = [
    build.entity.annotation("1"),
    build.entity.annotation("2")
  ];
  const sectionName = "Test";
  const section = build.entity.textSection("3");

  const component = renderer.create(
    <Group
      sectionName={sectionName}
      annotations={annotations}
      readerSection={section}
    />
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
