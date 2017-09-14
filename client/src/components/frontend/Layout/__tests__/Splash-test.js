import React from "react";
import renderer from "react-test-renderer";
import Splash from "../Splash";
import build from "test/fixtures/build";

describe("Frontend.Layout.Splash component", () => {
  const clickHandleMock = jest.fn();
  const feature = build.entity.feature(1);

  it("renders correctly", () => {
    const component = renderer.create(
      <Splash
        feature={feature}
        authenticated
        toggleSignInUpOverlay={clickHandleMock}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
