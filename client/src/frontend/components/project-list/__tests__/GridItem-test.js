import React from "react";
import renderer from "react-test-renderer";
import GridItem from "../GridItem";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.Project.Thumbnail component", () => {
  const project = build.entity.project("1");
  const dispatchMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <GridItem
          dispatch={dispatchMock}
          project={project}
          favorites={{}}
          authenticated
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
