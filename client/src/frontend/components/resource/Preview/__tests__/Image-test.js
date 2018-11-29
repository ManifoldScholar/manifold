import React from "react";
import renderer from "react-test-renderer";
import Image from "../Image";
import build from "test/fixtures/build";

describe("Frontend.Resource.Preview.Image component", () => {
  const resource = build.entity.resource("1");

  it("renders correctly", () => {
    const component = renderer.create(<Image resource={resource} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
