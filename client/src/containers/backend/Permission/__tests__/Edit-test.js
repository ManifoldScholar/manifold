import React from "react";
import renderer from "react-test-renderer";
import PermissionEdit from "../Edit";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Permission Edit Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const user = build.entity.user("2");
  const permission = build.entity.permission(
    "3",
    {},
    { resource: project, user }
  );

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <PermissionEdit
          entity={project}
          permission={permission}
          closeUrl={"http://www.dailyrowan.com"}
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
