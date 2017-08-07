import React from "react";
import renderer from "react-test-renderer";
import MobileNav from "../MobileNav";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.Layout.MobileNav component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<MobileNav location={{ pathname: "/" }} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
