import React from "react";
import renderer from "react-test-renderer";
import Hero from "../Hero";
import build from "test/fixtures/build";

describe("Frontend.Resource.Hero component", () => {
  const resource = build.entity.resource("1");

  it("renders correctly", () => {
    const component = renderer.create(<Hero resource={resource} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
