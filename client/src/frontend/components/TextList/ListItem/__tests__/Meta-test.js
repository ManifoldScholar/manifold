import React from "react";
import renderer from "react-test-renderer";
import Meta from "../Meta";
import build from "test/fixtures/build";

describe("Frontend.TextList.ListItem.Meta component", () => {

  it("renders correctly", () => {
    const component = renderer.create(
      <Meta
        text={build.entity.text("1")}
        baseClass={"text-block"}
        datesVisible
        datePrefix={"Added"}
        publishedVisible
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
