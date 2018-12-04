import React from "react";
import renderer from "react-test-renderer";
import Variants from "../Variants";

describe("Backend.Resource.Form.Variants component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Variants kind="file" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("when kind is image", () => {
    it("renders correctly", () => {
      const component = renderer.create(<Variants kind="image" />);
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("when kind is pdf", () => {
    it("renders correctly", () => {
      const component = renderer.create(<Variants kind="pdf" />);
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
