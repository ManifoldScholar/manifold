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

  const component = renderer.create(
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
