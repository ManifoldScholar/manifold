import React from "react";
import renderer from "react-test-renderer";
import { ProjectCollectionSettings } from "../Settings";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.Settings container", () => {
  const projectCollection = build.entity.projectCollection("1");
  const store = build.store();

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectCollectionSettings
          dispatch={store.dispatch}
          projectCollection={projectCollection}
          projectCollectionMeta={{ relationships: { collectionProjects: build.pagination() } }}
        />
      </Provider>
    )
  );
  const tree = component.toJSON();

  it("renders correctly", () => {
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    expect(tree).not.toBe(null);
  });
});
