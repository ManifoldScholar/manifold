import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { DashboardsAdminContainer } from "../Admin";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Backend Dashboards Admin Container", () => {
  const projects = [build.entity.project("1"), build.entity.project("2")];
  const projectsMeta = {
    pagination: build.pagination()
  };
  const recentProjects = [build.entity.project("3"), build.entity.project("4")];
  const store = build.store();

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <DashboardsAdminContainer
          projects={projects}
          projectsMeta={projectsMeta}
          recentProjects={recentProjects}
          dispatch={store.dispatch}
          currentUser={build.entity.user("5", {
            kind: "owner",
            abilities: { viewDrafts: true },
            classAbilities: { statistics: { read: true } }
          })}
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
