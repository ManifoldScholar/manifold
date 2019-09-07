import React from "react";
import renderer from "react-test-renderer";
import FieldGroup from "../FieldGroup";

describe("Backend.Form.FieldGroup component", () => {
  const child = <div>How is babby formed?</div>;

  it("renders correctly", () => {
    const component = renderer.create(<FieldGroup children={child} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
