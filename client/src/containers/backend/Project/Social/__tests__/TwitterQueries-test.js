import React from "react";
import renderer from "react-test-renderer";
import { ProjectSocialTwitterQueriesContainer } from "../TwitterQueries";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Project Social Twitter Queries Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const twitterQueries = [
    build.entity.twitterQuery("2", {}, { project: project })
  ];
  project.relationships.twitterQueries = twitterQueries;
  const match = {
    params: {
      qId: "2"
    }
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectSocialTwitterQueriesContainer
          project={project}
          dispatch={store.dispatch}
          twitterQueries={twitterQueries}
          twitterQueriesMeta={{
            pagination: build.pagination()
          }}
          match={match}
        />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
