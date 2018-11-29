import React from "react";
import renderer from "react-test-renderer";
import Link from "../Link";

describe("Backend.Resource.Form.Link component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Link />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
