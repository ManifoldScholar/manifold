import React from "react";
import renderer from "react-test-renderer";
import Quoted from "../Quoted";
import build from "test/fixtures/build";

const event = build.entity.event("1");

describe("Frontend.Event.Body.Quoted Component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <Quoted event={event} icon="book-opening" />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
