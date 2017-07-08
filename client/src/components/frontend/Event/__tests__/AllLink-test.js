import React from "react";
import renderer from "react-test-renderer";
import AllLink from "../AllLink";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.Event.AllLink Component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<AllLink count={5} threshold={3} projectId="1" />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
