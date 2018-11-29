import React from "react";
import renderer from "react-test-renderer";
import { ProjectDetailContainer } from "../ProjectDetail";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Frontend ProjectDetail Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const settings = build.entity.settings();

  const tree = renderer
    .create(
      wrapWithRouter(
        <Provider store={store}>
          <ProjectDetailContainer
            dispatch={store.dispatch}
            project={project}
            settings={settings}
            projectResponse={{}}
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
