import React from "react";
import renderer from "react-test-renderer";
import Created from "../Created";
import build from "test/fixtures/build";

const event = build.entity.event("1");

describe("Frontend.Event.Body.Created Component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <Created event={event} icon="book-opening" />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
