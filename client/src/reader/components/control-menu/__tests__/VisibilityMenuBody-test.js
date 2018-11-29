import React from "react";
import renderer from "react-test-renderer";
import VisibilityMenuBody from "../VisibilityMenuBody";

describe("Reader.ControlMenu.VisibilityMenuBody Component", () => {
  const props = {
    filter: {
      highlights: { yours: true, others: true },
      annotations: { yours: true, others: true },
      resources: { all: true }
    },
    filterChangeHandler: jest.fn()
  };

  it("renders correctly", () => {
    const component = renderer.create(<VisibilityMenuBody {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
