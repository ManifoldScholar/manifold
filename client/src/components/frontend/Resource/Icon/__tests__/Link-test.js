import React from "react";
import renderer from "react-test-renderer";
import Link from "../Link";

describe("Frontend.Resource.Link component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Link />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
