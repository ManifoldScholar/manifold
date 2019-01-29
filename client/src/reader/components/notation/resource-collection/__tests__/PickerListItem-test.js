import React from "react";
import PickerListItem from "../PickerListItem";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";

describe("Reader.Notation.Collection.PickerListItem component", () => {
  const collection = build.entity.collection("1");
  collection.relationships.project = build.entity.project("2");

  const root = <PickerListItem entity={collection} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
