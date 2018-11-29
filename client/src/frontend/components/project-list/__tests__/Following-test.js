import React from "react";
import renderer from "react-test-renderer";
import Following from "../Following";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.ProjectList.Following component", () => {
  const projectA = build.entity.project("1");
  const projectB = build.entity.project("2");
  const projects = [projectA, projectB];
  const favorites = {
    1: projectA,
    2: projectB
  };
  const user = build.entity.user("3");
  const dispatchMock = jest.fn();
  const updateMock = jest.fn();

  it("renders correctly", () => {
    user.favorites = favorites;
    const component = renderer.create(
      wrapWithRouter(
        <Following
          dispatch={dispatchMock}
          followedProjects={projects}
          authentication={{
            currentUser: user
          }}
          subjects={projects}
          handleUpdate={updateMock}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly with no projects", () => {
    user.favorites = {};
    const component = renderer.create(
      wrapWithRouter(
        <Following
          dispatch={dispatchMock}
          followedProjects={[]}
          authentication={{
            currentUser: user
          }}
          subjects={[]}
          handleUpdate={updateMock}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
