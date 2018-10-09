import React from "react";
import renderer from "react-test-renderer";
import Header from "../Header";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.ProjectCollection.Header component", () => {
  const projectCollection = build.entity.projectCollection("1");

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Header projectCollection={projectCollection} />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
