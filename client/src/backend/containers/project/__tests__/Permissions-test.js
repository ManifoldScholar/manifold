import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";
import ProjectPermissionsContainer from "../Permissions";
import { wrapWithRouter } from "test/helpers/routing";
import build from "test/fixtures/build";

describe("Backend Project Permissions Container", () => {
  const project = build.entity.project("1");
  const route = {
    routes: [],
    options: {}
  };

  const root = <ProjectPermissionsContainer project={project} route={route} />;

  it("renders correctly", () => {
    const renderer = new ShallowRenderer();
    const tree = renderer.render(root);
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    const renderer = new ShallowRenderer();
    const tree = renderer.render(root);
    expect(tree).not.toBe(null);
  });
});
