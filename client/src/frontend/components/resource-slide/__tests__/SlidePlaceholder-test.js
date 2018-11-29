import React from "react";
import renderer from "react-test-renderer";
import SlidePlaceholder from "../SlidePlaceholder";

describe("Frontend.ResourceList.Slide.SlidePlaceholder component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<SlidePlaceholder />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
