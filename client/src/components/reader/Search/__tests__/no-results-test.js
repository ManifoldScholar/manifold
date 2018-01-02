import React from "react";
import renderer from "react-test-renderer";
import NoResults from "../NoResults";

describe("Reader.Search.NoResults component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<NoResults />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
