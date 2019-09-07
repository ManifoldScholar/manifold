import React from "react";
import renderer from "react-test-renderer";
import GeneratedPasswordInput from "../GeneratedPasswordInput";

describe("Backend.Form.GeneratedPasswordInput component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <GeneratedPasswordInput
        value="attributes[password]"
        name="attributes[password]"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
