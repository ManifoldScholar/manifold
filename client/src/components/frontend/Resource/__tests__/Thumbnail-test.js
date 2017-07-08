import React from "react";
import renderer from "react-test-renderer";
import Thumbnail from "../Thumbnail";
import build from "test/fixtures/build";

describe("Frontend.Resource.Thumbnail component", () => {
  const resource = build.entity.resource("1");

  it("renders correctly", () => {
    const component = renderer.create(
      <Thumbnail resource={resource} projectId="1" showkind showtitle />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
