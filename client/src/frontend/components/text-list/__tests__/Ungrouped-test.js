import React from "react";
import renderer from "react-test-renderer";
import Ungrouped from "../Ungrouped";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.TextList.Ungrouped component", () => {
  const textA = build.entity.text("1");
  const textB = build.entity.text("2");

  const texts = [textA, textB];
  const visibility = {
    showAuthors: true,
    showCovers: true,
    showDates: true,
    showDescriptions: false,
    showSubtitles: false
  };

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Ungrouped texts={texts} visibility={visibility} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
