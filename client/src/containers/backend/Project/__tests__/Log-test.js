import React from "react";
import { LogContainer } from "../Log";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";

describe("Backend Project Log Container", () => {
  const project = build.entity.project("1");
  const store = build.store();
  const versionsMeta = { pagination: build.pagination() };
  const versions = [
    build.entity.version("1"),
    build.entity.version("2", { itemId: "1", itemType: "Project" })
  ];

  const component = wrapWithRouter(
    <Provider store={store}>
      <LogContainer
        project={project}
        dispatch={store.dispatch}
        versions={versions}
        versionsMeta={versionsMeta}
      />
    </Provider>
  );

  const snapshot = renderer.create(component).toJSON();

  it("renders correctly", () => {
    expect(snapshot).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    expect(snapshot).not.toBe(null);
  });
});
