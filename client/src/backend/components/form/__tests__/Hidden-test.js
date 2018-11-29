import React from "react";
import renderer from "react-test-renderer";
import Hidden from "../Hidden";

describe("Backend.Form.Hidden component", () => {
  const changeMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      <Hidden value="attributes[fake]" onChange={changeMock} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
