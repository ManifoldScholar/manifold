import React from "react";
import renderer from "react-test-renderer";
import { wrapWithRouter } from "test/helpers/routing";
import Section from "reader/components/section";
import build from "test/fixtures/build";

describe("NextSection component", () => {
  const sectionId = "1234-5678-9000";
  const sectionsMap = [
    { id: "1234-5678-9000", name: "First Section" },
    { id: "2345-5678-1111", name: "Second Section" }
  ];
  const text = build.entity.text("1");

  const typography = {
    margins: [0, 1, 2]
  };

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Section.NextSection
          sectionId={sectionId}
          sectionsMap={sectionsMap}
          text={text}
          typography={typography}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
