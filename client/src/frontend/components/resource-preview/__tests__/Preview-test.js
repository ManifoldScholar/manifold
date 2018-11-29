import React from "react";
import renderer from "react-test-renderer";
import Preview from "../";
import build from "test/fixtures/build";

describe("Frontend.Resource.Preview component", () => {
  const resource = build.entity.resource("1");

  it("renders correctly", () => {
    const component = renderer.create(
      <Preview resource={resource}>
        <div>Test Button</div>
      </Preview>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
