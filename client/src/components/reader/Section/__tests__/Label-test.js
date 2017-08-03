import React from "react";
import Label from "../Label";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";

describe("Reader.Section.Label component", () => {
  const root = <Label label={"Hip Hop Classics"} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
