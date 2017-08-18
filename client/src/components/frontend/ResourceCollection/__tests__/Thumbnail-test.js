import React from "react";
import renderer from "react-test-renderer";
import Thumbnail from "../Thumbnail";
import build from "test/fixtures/build";

describe("Frontend.ResourceCollection.Thumbnail component", () => {
  const resourceCollection = build.entity.collection("1");
  resourceCollection.relationships.resources.push(build.entity.resource("2"));
  resourceCollection.relationships.resources.push(build.entity.resource("3"));

  it("renders correctly", () => {
    const component = renderer.create(
      <Thumbnail resourceCollection={resourceCollection} showtitle />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
