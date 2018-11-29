jest.mock("react-html5video");

import React from "react";
import renderer from "react-test-renderer";
import SlideVideo from "../SlideVideo";
import build from "test/fixtures/build";

describe("Frontend.ResourceList.Slide.SlideVideo component", () => {
  const resource = build.entity.resource("1");
  resource.attributes.kind = "video";
  resource.attributes.subKind = "external_video";
  resource.attributes.externalType = "youtube";
  resource.attributes.externalId = "lVrAwK7FaOw";

  it("renders correctly", () => {
    const component = renderer.create(<SlideVideo resource={resource} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
