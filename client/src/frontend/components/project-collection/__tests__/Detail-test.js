import React from "react";
import renderer from "react-test-renderer";
import Detail from "../Detail";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.ProjectCollection.Detail component", () => {
  const projects = [build.entity.project("1"), build.entity.project("2")];
  const projectCollection = build.entity.projectCollection(
    "1",
    {},
    { projects }
  );

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Detail
          projectCollection={projectCollection}
          projects={projects}
          pagination={build.pagination()}
          paginationClickHandler={jest.fn}
          filterChangeHandler={jest.fn}
          authentication={{}}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
