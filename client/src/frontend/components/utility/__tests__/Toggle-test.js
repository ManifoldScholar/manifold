import React from "react";
import renderer from "react-test-renderer";
import Toggle from "../Toggle";

describe("Frontend.Utility.Toggle component", () => {
  const toggleMock = jest.fn();

  const root = (
    <Toggle
      handleToggle={toggleMock}
      optionOne={{
        iconClass: "manicon-cube-outline",
        label: "resources"
      }}
      optionTwo={{
        iconClass: "manicon-file-box",
        label: "collection"
      }}
      selected="resources"
    />
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
