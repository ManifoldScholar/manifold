import React from "react";
import Pagination from "../Pagination";
import renderer from "react-test-renderer";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import build from "test/fixtures/build";

describe("Reader.Section.Pagination component", () => {
  const text = build.entity.text("1");
  const root = wrapWithRouter(
    <Pagination text={text} sectionId={"2"} spine={["1234", "5678", "0000"]} />
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
