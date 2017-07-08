import React from "react";
import renderer from "react-test-renderer";
import Meta from "../Meta";
import build from "test/fixtures/build";

describe("Frontend.Project.Meta component", () => {
  const metadata = {
    title: "Southernplayalisticadillacmuzik",
    releaseDate: "April 26, 1994"
  };

  it("renders correctly", () => {
    const component = renderer.create(<Meta metadata={metadata} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
