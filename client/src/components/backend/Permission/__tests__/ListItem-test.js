import React from "react";
import renderer from "react-test-renderer";
import ListItem from "../ListItem";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Permission.ListItem component", () => {
  const project = build.entity.project("1");
  const user = build.entity.user("2");
  const permission = build.entity.permission("3");
  permission.relationships = { resource: project, user };

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <ListItem entity={permission} linkName="backendProjectPermissions" />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
