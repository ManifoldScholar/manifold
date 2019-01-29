import React from "react";
import renderer from "react-test-renderer";
import Grid from "../Grid";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.ResourceCollectionList.Grid component", () => {
  const project = build.entity.project("1");
  const collections = [
    build.entity.resourceCollection("1"),
    build.entity.resourceCollection("2")
  ];
  project.relationships.resourceCollections = collections;

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Grid project={project} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
