import React from "react";
import renderer from "react-test-renderer";
import { ProjectCollectionDetail } from "../Detail";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.Detail container", () => {
  const projects = [build.entity.project("1"), build.entity.project("2")];
  const projectCollection = build.entity.projectCollection(
    "1",
    {},
    { collectionProjects: [] }
  );
  const store = build.store();

  const collectionProjects = [
    build.entity.collectionProject("3", {}, { project: projects[0] })
  ];

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectCollectionDetail
          projectCollection={projectCollection}
          collectionProjects={collectionProjects}
          dispatch={store.dispatch}
          route={{
            routes: []
          }}
          match={{
            params: {}
          }}
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
