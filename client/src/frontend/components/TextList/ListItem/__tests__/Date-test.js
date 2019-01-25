import React from "react";
import renderer from "react-test-renderer";
import Date from "../Date";
import build from "test/fixtures/build";

describe("Frontend.TextList.ListItem.Date component", () => {

  it("renders correctly", () => {
    const component = renderer.create(
      <Date
        date={build.entity.text("1").attributes.createdAt}
        datePrefix={"Added"}
        baseClass={"text-block"}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
