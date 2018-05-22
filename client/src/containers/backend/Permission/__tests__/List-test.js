import React from "react";
import renderer from "react-test-renderer";
import { PermissionContainer } from "../List";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Permissions List Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const user = build.entity.user("3");
  const permissions = [
    build.entity.permission("2", {}, { resource: project, user: user })
  ];
  project.relationships.permissions = permissions;
  const match = {
    params: {
      id: "2"
    }
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <PermissionContainer
          entity={project}
          dispatch={store.dispatch}
          permissions={permissions}
          project={project}
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
