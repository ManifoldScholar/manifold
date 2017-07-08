import React from "react";
import renderer from "react-test-renderer";
import Presentation from "../Presentation";

describe("Backend.Resource.Form.Presentation component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Presentation />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
