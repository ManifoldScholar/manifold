import React from "react";
import renderer from "react-test-renderer";
import { ProjectCollectionManageProjects } from "../ManageProjects";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.ManageProjects container", () => {
  const projects = [build.entity.project("1"), build.entity.project("2")];
  const projectCollection = build.entity.projectCollection("1", {}, { projects });
  const store = build.store();

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectCollectionManageProjects
          dispatch={store.dispatch}
          projectCollection={projectCollection}
          projects={projects}
          projectsMeta={{ pagination: build.pagination() }}
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
