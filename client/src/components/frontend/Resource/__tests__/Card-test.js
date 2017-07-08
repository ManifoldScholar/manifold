import React from "react";
import renderer from "react-test-renderer";
import Card from "../Card";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.Resource.Card component", () => {
  const resource = build.entity.resource("1");
  const project = build.entity.project("2");

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Card resource={resource} context={project} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
