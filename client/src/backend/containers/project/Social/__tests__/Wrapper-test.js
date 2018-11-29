import React from "react";
import { mount } from "enzyme";
import ProjectSocialWrapperContainer from "../Wrapper";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Project Social Wrapper Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const route = {
    routes: [],
    options: {}
  };

  const component = mount(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectSocialWrapperContainer route={route} project={project} />
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
