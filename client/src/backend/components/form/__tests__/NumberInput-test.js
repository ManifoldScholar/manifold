import React from "react";
import renderer from "react-test-renderer";
import Form from "backend/components/form";

describe("Backend.Form.NumberInput component", () => {
  const onChange = jest.fn();

  const element = (
    <Form.NumberInput
      label="A form label"
      name="attributes[property]"
      onChange={onChange}
    />
  );

  it("renders correctly", () => {
    const component = renderer.create(element);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
