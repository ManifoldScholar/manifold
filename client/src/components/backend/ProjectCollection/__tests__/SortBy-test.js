import React from "react";
import renderer from "react-test-renderer";
import SortBy from "../SortBy";
import build from "test/fixtures/build";

describe("Backend.ProjectCollection.SortBy component", () => {
  const projectCollection = build.entity.projectCollection("1");

  it("renders correctly", () => {
    const component = renderer.create(
      <SortBy
        projectCollection={projectCollection}
        sortChangeHandler={jest.fn}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
