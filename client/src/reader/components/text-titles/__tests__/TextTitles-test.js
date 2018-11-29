import React from "react";
import renderer from "react-test-renderer";
import TextTitles from "../";

describe("Reader.TextTitles Component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <TextTitles
        textTitle="Rowan: Greatest Dog"
        sectionTitle="Chapter 1"
        showSection
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
