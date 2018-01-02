import React from "react";
import renderer from "react-test-renderer";
import Group from "../Group";
import build from "test/fixtures/build";

describe("Reader.Notes.Full.Group Component", () => {
  const annotations = [
    build.entity.annotation("1"),
    build.entity.annotation("2")
  ];

  const component = renderer.create(
    <Group
      header="Test"
      annotations={annotations}
      handleDeleteAnnotation={jest.fn()}
      handleUpdateAnnotation={jest.fn()}
      handleVisitAnnotation={jest.fn()}
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
