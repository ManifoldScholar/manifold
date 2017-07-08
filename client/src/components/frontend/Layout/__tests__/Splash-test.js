import React from "react";
import renderer from "react-test-renderer";
import Splash from "../Splash";

describe("Frontend.Layout.Splash component", () => {
  const clickHandleMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      <Splash authenticated toggleSignInUpOverlay={clickHandleMock} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
