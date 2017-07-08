import React from "react";
import renderer from "react-test-renderer";
import Link from "../Link";

describe("Frontend.Resource.Link component", () => {
  const resource = {
    attributes: {
      kind: "link",
      externalUrl: "http://www.dailyrowan.com"
    }
  };

  it("renders correctly", () => {
    const component = renderer.create(
      <Link attributes={resource.attributes} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
