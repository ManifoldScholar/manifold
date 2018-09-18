import React from "react";
import renderer from "react-test-renderer";
import { Form } from "components/backend";

describe("Backend.Form.TagList component", () => {
  const element = (
    <Form.TagList
      label="Tags"
      name="attributes[tags]"
    />
  );

  it("renders correctly", () => {
    const component = renderer.create(element);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
