import React from "react";
import { mount } from "enzyme";
import Detail from "../Detail";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Reader.Notation.Collection.Detail component", () => {
  const pagination = build.pagination();
  const store = build.store();

  const project = build.entity.project("1");
  const collection = build.entity.collection("2", { projectId: "1" });
  const resource = build.entity.resource("3", { projectId: "1" });
  const collectionResource = build.entity.collectionResource("4", {
    collectionId: "2",
    resourceId: "3"
  });
  collection.relationships.resources.push(resource);
  resource.relationships.collectionResources.push(collectionResource);
  project.relationships.resources.push(resource);
  const resources = project.relationships.resources;

  const pageChangeMock = jest.fn();
  const filterChangeMock = jest.fn();
  const closeMock = jest.fn();

  const component = renderer.create(
    wrapWithRouter(
      <Detail
        project={project}
        slideshowResources={resources}
        slideshowPagination={pagination}
        collectionResources={resources}
        collectionPagination={pagination}
        collectionPaginationHandler={pageChangeMock}
        collection={collection}
        collectionUrl={`/browse/project/${project.id}/collection/${collection.id}`}
        filterChange={filterChangeMock}
        handleClose={closeMock}
        initialFilterState={null}
      />
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
