import React from "react";
import renderer from "react-test-renderer";
import ProjectResourcesContainer from "../Resources";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Project Resources Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  store.dispatch({
    type: "UPDATE_CURRENT_USER",
    error: false,
    payload: {
      data: build.entity.user("1")
    }
  });

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectResourcesContainer
          project={project}
          dispatch={store.dispatch}
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
