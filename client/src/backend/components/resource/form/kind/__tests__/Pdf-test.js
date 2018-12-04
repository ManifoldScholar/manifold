import React from "react";
import renderer from "react-test-renderer";
import Pdf from "../Pdf";

describe("Backend.Resource.Form.Pdf component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Pdf />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
