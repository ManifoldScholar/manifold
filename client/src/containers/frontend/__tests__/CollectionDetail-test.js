import React from "react";
import renderer from "react-test-renderer";
import { CollectionDetailContainer } from "../CollectionDetail";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend CollectionDetail Container", () => {
  const pagination = build.pagination();
  const store = build.store();

  const settings = build.entity.settings();
  const project = build.entity.project("1");
  const collectionResource = build.entity.collectionResource("4");
  const resource = build.entity.resource("3", {}, { project, collectionResources: [collectionResource] });
  const collection = build.entity.collection("2", {}, { project, resources: [resource] });
  project.relationships.resources.push(resource);
  const resources = project.relationships.resources;

  const pageChangeMock = jest.fn();
  const filterChangeMock = jest.fn();

  const props = {
    settings,
    project,
    collection,
    params: { id: "2" },
    resources: resources,
    resourcesMeta: { pagination },
    slideshowResources: resources,
    slideshowResourcesMeta: { pagination },
    collectionResources: resources,
    collectionPagination: pagination,
    collectionPaginationHandler: pageChangeMock,
    collectionUrl: `/browse/project/${project.id}/collection/${collection.id}`,
    filterChange: filterChangeMock,
    initialFilterState: null,
    location: { query: null }
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <CollectionDetailContainer {...props} />
      </Provider>
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
