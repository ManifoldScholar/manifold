import React from "react";
import GroupThumbnail from "../GroupThumbnail";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";

describe("Reader.Resource.Viewer.GroupThumbnail component", () => {
  const resource = build.entity.resource("1");

  const root = <GroupThumbnail resource={resource} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
