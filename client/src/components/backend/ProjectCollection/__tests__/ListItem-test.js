import React from "react";
import renderer from "react-test-renderer";
import ListItem from "../ListItem";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.ProjectCollection.ListItem component", () => {
  const projectCollection = build.entity.projectCollection("1");

  it("renders correctly", () => {
    const component = renderer.create(
      <ListItem
        clickHandler={jest.fn}
        visibilityToggleHandler={jest.fn}
        entity={projectCollection}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
