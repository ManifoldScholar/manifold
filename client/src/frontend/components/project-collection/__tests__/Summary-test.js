import React from "react";
import renderer from "react-test-renderer";
import Summary from "../Summary";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Frontend.ProjectCollection.Placeholder component", () => {
  const store = build.store();
  const collectionProjects = [
    { id: "1", relationships: { project: build.entity.project("1") } },
    { id: "2", relationships: { project: build.entity.project("2") } }
  ];
  const projectCollection = build.entity.projectCollection(
    "1",
    { projectsCount: 2 },
    { collectionProjects }
  );

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Summary
            projectCollection={projectCollection}
            dispatch={store.dispatch}
            limit={1}
            authentication={{}}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
