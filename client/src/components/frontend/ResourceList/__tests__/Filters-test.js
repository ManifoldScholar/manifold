import React from "react";
import renderer from "react-test-renderer";
import Filters from "../Filters";

describe("Frontend.ResourceList.Filters Component", () => {
  const tags = ["dog", "puppy"];
  const kinds = ["image", "video"];
  const filterChangeMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      <Filters
        tags={tags}
        kinds={kinds}
        filterChangeHandler={filterChangeMock}
        initialFilterState={{}}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
