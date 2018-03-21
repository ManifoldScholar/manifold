import React from "react";
import renderer from "react-test-renderer";
import { HomeContainer } from "../Home";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend Home Container", () => {
  const store = build.store();
  const featuredProjects = [
    build.entity.project("1"),
    build.entity.project("2")
  ];
  const followedProjects = [
    build.entity.project("3"),
    build.entity.project("4")
  ];
  const user = build.entity.user("5");
  user.favorites = {
    0: build.entity.project("6")
  };
  const authentication = {
    authenticated: true,
    currentUser: user
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <HomeContainer
          authentication={authentication}
          featuredProjects={featuredProjects}
          followedProjects={followedProjects}
          fetchData={jest.fn()}
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
