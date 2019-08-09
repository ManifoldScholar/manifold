import React from "react";
import renderer from "react-test-renderer";
import Save from "../Save";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Form.Save component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Save text="Save" cancelRoute="cancel/this" />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
