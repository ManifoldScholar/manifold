import React from "react";
import renderer from "react-test-renderer";
import { ResourceDetailContainer } from "../ResourceDetail";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Frontend ResourceDetail Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const resource = build.entity.resource("2");
  resource.relationships.project = project;

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ResourceDetailContainer
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
