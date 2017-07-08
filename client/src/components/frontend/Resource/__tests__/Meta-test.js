import React from "react";
import renderer from "react-test-renderer";
import Meta from "../Meta";
import build from "test/fixtures/build";

describe("Frontend.Resource.Meta component", () => {
  const resource = build.entity.resource("1");

  it("renders correctly", () => {
    const component = renderer.create(
      <Meta resource={resource} showIcon showTags projectUrl="project/url" />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
