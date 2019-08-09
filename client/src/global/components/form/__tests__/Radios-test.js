import React from "react";
import renderer from "react-test-renderer";
import Radios from "../Radios";

describe("Backend.Form.Radios component", () => {
  const options = [
    {
      label: "option-1",
      instructions: "What does this option really mean?",
      value: "1"
    },
    {
      label: "option-2",
      value: "2"
    }
  ];

  it("renders correctly", () => {
    const component = renderer.create(
      <Radios options={options} label="Label this" prompt="Pick the right choice" name="attributes[fake]" />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
