import React from "react";
import renderer from "react-test-renderer";
import { FollowingContainer } from "../";
import build from "test/fixtures/build";
import auth from "test/helpers/auth";
import wrapWithContext from "test/helpers/wrapWithContext";

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
      wrapWithContext(
        <FollowingContainer
          authentication={authentication}
          featuredProjects={featuredProjects}
          followedProjects={followedProjects}
          dispatch={store.dispatch}
        />,
        store
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
