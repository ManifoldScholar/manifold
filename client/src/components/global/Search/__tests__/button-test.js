import React from "react";
import renderer from "react-test-renderer";
import Button from "../Menu/Button";

describe("Reader.Search.Button component", () => {
  it("renders correctly when inactive", () => {
    const component = renderer.create(
      <Button active={false} toggleSearchMenu={() => {}} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when active", () => {
    const component = renderer.create(
      <Button active={true} toggleSearchMenu={() => {}} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
