import React from "react";
import renderer from "react-test-renderer";
import NotFound from "../NotFound";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend Not Found Container", () => {
  const component = renderer.create(<NotFound />);

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
