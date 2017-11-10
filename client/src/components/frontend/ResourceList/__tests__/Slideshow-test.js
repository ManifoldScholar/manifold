import React from "react";
import renderer from "react-test-renderer";
import Slideshow from "../Slideshow";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.ResourceList.Slideshow Component", () => {
  const collection = build.entity.collection("3");
  const collectionResources = [
    build.entity.resource("1"),
    build.entity.resource("2")
  ];
  const pagination = {
    currentPage: 1,
    perPage: 5,
    totalCount: 10,
    nextPage: 2,
    prevPage: 0,
    totalPages: 2
  };
  const dispatchMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Slideshow
          collectionResources={collectionResources}
          collection={collection}
          pagination={pagination}
          count={5}
          dispatch={dispatchMock}
          collectionId="1"
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly with no resources", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Slideshow
          collectionResources={[]}
          collection={collection}
          pagination={pagination}
          count={5}
          dispatch={dispatchMock}
          collectionId="1"
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
