import React from "react";
import renderer from "react-test-renderer";
import List from "../List";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.ProjectCollection.List component", () => {
  const projectCollection = build.entity.projectCollection("1");

  it("renders correctly", () => {
    const component = renderer.create(
      <List
        projectCollection={projectCollection}
        projectCollections={[
          projectCollection,
          build.entity.projectCollection("2")
        ]}
        onCollectionOrderChange={jest.fn}
        onCollectionSelect={jest.fn}
        onShowNew={jest.fn}
        onToggleVisibility={jest.fn}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
