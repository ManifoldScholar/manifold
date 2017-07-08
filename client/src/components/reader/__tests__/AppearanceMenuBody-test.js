import React from "react";
import renderer from "react-test-renderer";
import AppearanceMenuBody from "../AppearanceMenuBody";

describe("Reader.AppearanceMenuBody Component", () => {
  const appearance = {
    typography: {
      fontSize: {}
    },
    colors: {}
  };

  it("renders correctly", () => {
    const component = renderer.create(
      <AppearanceMenuBody appearance={appearance} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
