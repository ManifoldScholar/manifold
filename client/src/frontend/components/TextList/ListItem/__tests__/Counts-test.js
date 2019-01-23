import React from "react";
import renderer from "react-test-renderer";
import Counts from "../Counts";
import build from "test/fixtures/build";

describe("Frontend.TextList.ListItem.Counts component", () => {

  it("renders correctly", () => {
    const component = renderer.create(
      <Counts
        text={build.entity.text("1")}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
