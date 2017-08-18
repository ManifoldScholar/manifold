import React from "react";
import renderer from "react-test-renderer";
import Cover from "../Cover";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.ResourceCollection.Cover component", () => {
  const resourceCollection = build.entity.collection("1");
  resourceCollection.relationships.resources.push(build.entity.resource("2"));
  resourceCollection.relationships.resources.push(build.entity.resource("3"));

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Cover resourceCollection={resourceCollection} projectId="1" />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
