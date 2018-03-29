import React from "react";
import renderer from "react-test-renderer";
import Cards from "../Cards";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.ResourceList.Cards Component", () => {
  const project = build.entity.project("1");
  const resources = [
    build.entity.resource("2", {}, { project }),
    build.entity.resource("3", {}, { project })
  ];
  const pagination = {
    currentPage: 1,
    perPage: 5,
    totalCount: 10,
    nextPage: 2,
    prevPage: 0,
    totalPages: 2
  };
  const pageChangeMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Cards
          project={project}
          resources={resources}
          pagination={pagination}
          paginationClickHandler={() => pageChangeMock}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
