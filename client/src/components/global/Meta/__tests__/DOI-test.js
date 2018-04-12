import React from "react";
import renderer from "react-test-renderer";
import DOI from "../DOI";

describe("Global.Meta.DOI component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<DOI label="doi" doi="https://doi.org/10.12345.6789" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
