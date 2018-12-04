import React from "react";
import renderer from "react-test-renderer";
import Filters from "../Filters";

describe("Reader.Notes.Partial.Group Component", () => {
  const props = {
    filter: {
      formats: ["highlight", "annotation", "bookmark"]
    },
    filterChangeHandler: jest.fn()
  };

  const component = renderer.create(<Filters {...props} />);

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
