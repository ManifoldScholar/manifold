import React from "react";
import renderer from "react-test-renderer";
import KindPicker from "../KindPicker";

describe("Backend.Resource.Form.KindPicker component", () => {
  function getModelValue(kind) {
    return kind;
  }

  it("renders correctly", () => {
    const component = renderer.create(
      <KindPicker
        name="attributes[kind]"
        getModelValue={() => getModelValue("image")}
        includeButtons
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
