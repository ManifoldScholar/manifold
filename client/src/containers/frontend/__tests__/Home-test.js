import React from "react";
import renderer from "react-test-renderer";
import { HomeContainer } from "../Home";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend Home Container", () => {
  const store = build.store();
  const projects = [
    build.entity.project("1"),
    build.entity.project("2")
  ];
  const followedProjects = [
    build.entity.project("3"),
    build.entity.project("4")
  ];
  const projectCollections = [
    build.entity.projectCollection("1"),
    build.entity.projectCollection("2")
  ]
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
          followedProjects={followedProjects}
          projects={projects}
          fetchData={jest.fn()}
        />
      </Provider>
    )
  );

  const withCollections = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <HomeContainer
          authentication={authentication}
          followedProjects={followedProjects}
          projects={projects}
          projectCollections={projectCollections}
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

  it("renders correctly with project collections present", () => {
    let tree = withCollections.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
