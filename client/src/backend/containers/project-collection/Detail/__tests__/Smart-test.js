import React from "react";
import renderer from "react-test-renderer";
import Smart from "../Smart";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.Detail.Smart component", () => {
  const projectCollection = build.entity.projectCollection("1", {
    manuallySorted: false
  });
  const project = build.entity.project("2");
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Smart projectCollection={projectCollection} projects={[project]} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
