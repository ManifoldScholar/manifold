jest.mock("react-text-mask", () => () => "ReactTextMask");

import React from "react";
import ProjectGeneralContainer from "../General";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";

describe("Backend Project General Container", () => {
  const project = build.entity.project("1");
  const subject = build.entity.subject("2");
  project.relationships.subjects = [subject];
  const currentUser = build.entity.user("1");
  const store = build.store();
  store.dispatch({
    type: "UPDATE_CURRENT_USER",
    error: false,
    payload: {
      data: currentUser
    }
  });

  const component = wrapWithRouter(
    <Provider store={store}>
      <ProjectGeneralContainer project={project} />
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
