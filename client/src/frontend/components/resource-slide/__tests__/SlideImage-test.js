import React from "react";
import renderer from "react-test-renderer";
import SlideImage from "../SlideImage";
import build from "test/fixtures/build";

describe("Frontend.ResourceList.Slide.SlideImage component", () => {
  const resource = build.entity.resource("1");

  it("renders correctly", () => {
    const component = renderer.create(<SlideImage resource={resource} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
