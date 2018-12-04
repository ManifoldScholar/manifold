import React from "react";
import PickerListItem from "../PickerListItem";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";

describe("Reader.Notation.Resource.PickerListItem component", () => {
  const resource = build.entity.resource("1");
  resource.relationships.project = build.entity.project("2");

  const root = <PickerListItem entity={resource} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
