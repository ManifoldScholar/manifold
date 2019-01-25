import React from "react";
import renderer from "react-test-renderer";
import Bibliographic from "../Bibliographic";
import build from "test/fixtures/build";

describe("Frontend.TextList.ListItem.Bibliographic component", () => {
  const text = build.entity.text("1");

  it("renders correctly", () => {
    const component = renderer.create(
      <Bibliographic
        baseClass={"text-block"}
        description={text.attributes.description}
        subtitle={text.attributes.subtitle}
        date={text.attributes.createdAt}
        title={text.attributes.title}
        creatorNames={text.attributes.creatorNames}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
