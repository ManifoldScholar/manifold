import React from "react";
import renderer from "react-test-renderer";
import { FeaturedContainer } from "../";
import build from "test/fixtures/build";
import wrapWithContext from "test/helpers/wrapWithContext";

describe("Frontend Featured Container", () => {
  const store = build.store();

  const projects = [build.entity.project("1"), build.entity.project("2")];
  const authentication = {
    authenticated: true,
    currentUser: build.entity.user("3")
  };

  const component = renderer.create(
    wrapWithContext(
      <FeaturedContainer
        authentication={authentication}
        featuredProjects={projects}
      />,
      store
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
