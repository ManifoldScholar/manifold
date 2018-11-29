import React from "react";
import renderer from "react-test-renderer";
import { ProjectCollectionDetailContainer } from "../";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Frontend ProjectCollection Detail Container", () => {
  const store = build.store();
  const projectCollection = build.entity.projectCollection("1");
  const projects = [build.entity.project("1"), build.entity.project("2")];

  const tree = renderer
    .create(
      wrapWithRouter(
        <Provider store={store}>
          <ProjectCollectionDetailContainer
            projectCollection={projectCollection}
            projects={projects}
            projectsMeta={{ pagination: build.pagination() }}
            dispatch={store.dispatch}
            settings={build.entity.settings()}
            authentication={{}}
            match={{ params: {} }}
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
