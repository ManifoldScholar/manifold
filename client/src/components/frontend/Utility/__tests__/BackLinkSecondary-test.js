import React from "react";
import renderer from "react-test-renderer";
import BackLinkSecondary from "../BackLinkSecondary";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.Utility.BackLinkSecondary component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<BackLinkSecondary link="test/link" title="test" />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
