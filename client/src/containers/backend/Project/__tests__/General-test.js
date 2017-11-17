import React from "react";
import { mount } from "enzyme";
import ProjectGeneralContainer from "../General";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Project General Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const subject = build.entity.subject("2");
  project.relationships.subjects = [subject];

  const component = mount(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectGeneralContainer project={project} />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.debug();
    expect(tree).not.toBe(null);
  });
});
