import React from "react";
import renderer from "react-test-renderer";
import Avatar from "../Avatar";
import build from "test/fixtures/build";

describe("Frontend.Maker.Avatar component", () => {
  const user = build.entity.user("1");

  it("renders correctly", () => {
    const component = renderer.create(<Avatar maker={user} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
