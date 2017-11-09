import React from "react";
import renderer from "react-test-renderer";
import AllLink from "../AllLink";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

const project = build.entity.project("1");

describe("Frontend.Event.AllLink Component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<AllLink count={5} threshold={3} project={project} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
