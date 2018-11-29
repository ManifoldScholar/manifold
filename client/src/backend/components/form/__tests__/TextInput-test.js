import React from "react";
import renderer from "react-test-renderer";
import Form from "backend/components/form";
import { shallow, mount, render } from "enzyme";

describe("Backend.Form.TextInput component", () => {
  const onChange = jest.fn();

  const element = (
    <Form.TextInput
      label="A form label"
      name="attributes[property]"
      mask="hashtag"
      onChange={onChange}
    />
  );

  it("renders correctly", () => {
    const component = renderer.create(element);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
