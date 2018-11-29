import React from "react";
import renderer from "react-test-renderer";
import InputError from "../InputError";

describe("Global.Form.InputError component", () => {
  const error = {
    detail: "can't be blank",
    source: {
      pointer: "/data/attributes/name"
    }
  };

  it("renders correctly", () => {
    const component = renderer.create(<InputError errors={[error]} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
