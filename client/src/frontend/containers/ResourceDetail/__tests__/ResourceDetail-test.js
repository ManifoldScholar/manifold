import React from "react";
import renderer from "react-test-renderer";
import { ResourceDetailContainer } from "../";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Frontend ResourceDetail Container", () => {
  const store = build.store();
  const settings = build.entity.settings("1");
  const project = build.entity.project("1");
  const resource = build.entity.resource("2", { projectId: "1" });
  resource.relationships.project = project;

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ResourceDetailContainer
          settings={settings}
          dispatch={store.dispatch}
          project={project}
          resource={resource}
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
