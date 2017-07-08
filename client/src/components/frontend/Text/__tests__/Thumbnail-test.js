import React from "react";
import renderer from "react-test-renderer";
import Thumbnail from "../Thumbnail";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.Text.Thumbnail component", () => {
  const text = build.entity.text("1");

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Thumbnail text={text} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
