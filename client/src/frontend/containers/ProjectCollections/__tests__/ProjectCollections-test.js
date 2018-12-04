import React from "react";
import renderer from "react-test-renderer";
import { ProjectsCollectionsContainer } from "../";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Frontend ProjectCollections Container", () => {
  const store = build.store();
  const projectCollections = [
    build.entity.projectCollection("1"),
    build.entity.projectCollection("2")
  ];

  const tree = renderer
    .create(
      wrapWithRouter(
        <Provider store={store}>
          <ProjectsCollectionsContainer
            projectCollections={projectCollections}
            meta={{ pagination: build.pagination() }}
            dispatch={store.dispatch}
            authentication={{}}
            match={{ params: {} }}
            fetchData={jest.fn}
            location={{}}
          />
        </Provider>
      )
    )
    .toJSON();

  it("renders correctly", () => {
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    expect(tree).not.toBe(null);
  });
});
