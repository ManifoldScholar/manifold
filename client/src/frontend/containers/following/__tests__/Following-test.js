import React from "react";
import renderer from "react-test-renderer";
import { FollowingContainer } from "../Following";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import auth from "test/helpers/auth";

describe("Frontend Following Container", () => {
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

  const component = () =>
    renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <FollowingContainer
            authentication={authentication}
            featuredProjects={featuredProjects}
            followedProjects={followedProjects}
            dispatch={store.dispatch}
          />
        </Provider>
      )
    );

  it("renders correctly", () => {
    global.scrollTo = jest.fn();
    auth.startSession(store.dispatch, user);
    let tree = component().toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    global.scrollTo = jest.fn();
    auth.startSession(store.dispatch, user);
    let tree = component().toJSON();
    expect(tree).not.toBe(null);
  });
});
