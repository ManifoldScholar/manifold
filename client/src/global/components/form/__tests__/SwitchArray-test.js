import React from "react";
import renderer from "react-test-renderer";
import SwitchArray from "../SwitchArray";

describe("Backend.Form.SwitchArray component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <SwitchArray
        label="Label this"
        name="attributes[fake]"
        options={[
          { label: "Option one", value: "1" },
          { label: "Option two", value: "2" }
        ]}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
