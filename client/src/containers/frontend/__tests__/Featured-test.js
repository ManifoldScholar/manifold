import React from "react";
import renderer from "react-test-renderer";
import { FeaturedContainer } from "../Featured";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend Featured Container", () => {
  const store = build.store();

  const projects = [build.entity.project("1"), build.entity.project("2")];
  const authentication = {
    authenticated: true,
    currentUser: build.entity.user("3")
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <FeaturedContainer
          authentication={authentication}
          featuredProjects={projects}
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
