jest.mock("react-html5video");

import React from "react";
import renderer from "react-test-renderer";
import Video from "../Video";
import build from "test/fixtures/build";

describe("Frontend.Resource.Preview.Video component", () => {
  const resource = build.entity.resource("1", { variantPosterStyles: {} });

  it("renders correctly", () => {
    const component = renderer.create(<Video resource={resource} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
