import React from "react";
import renderer from "react-test-renderer";
import Hero from "../Hero";
import build from "test/fixtures/build";

describe("Frontend.Project.Hero component", () => {
  const actionCallout = build.entity.actionCallout("1");
  const project = build.entity.project("1", {}, {actionCallouts: [actionCallout]});

  const refMock = element => {
    return { style: { objectFit: "" }};
  }

  it("renders correctly", () => {
    const component = renderer.create(<Hero project={project} />, { createNodeMock: refMock });
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when object-fit is unsupported", () => {
    const component = renderer.create(<Hero project={project} />, { createNodeMock: element => {return { style: {}}} });
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
