import React from "react";
import renderer from "react-test-renderer";
import SimpleList from "../SimpleList";
import { Project } from "components/backend";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.Resource.Card component", () => {
  const projects = [build.entity.project("1"), build.entity.project("2")];

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <SimpleList
          entities={projects}
          entityComponent={Project.ListItem}
          title={"3030"}
          icon={"person"}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
