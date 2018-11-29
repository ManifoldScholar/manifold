import React from "react";
import renderer from "react-test-renderer";
import Hero from "../Hero";
import build from "test/fixtures/build";

describe("Frontend.Project.Hero component", () => {
  const project = build.entity.project("1");

  it("renders correctly", () => {
    const component = renderer.create(<Hero project={project} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
