jest.mock("react-collapse");

import React from "react";
import renderer from "react-test-renderer";
import { ResourceCollection } from "components/frontend";
import { Provider } from "react-redux";
import { wrapWithRouter } from "test/helpers/routing";
import build from "test/fixtures/build";

describe("Frontend.ResourceCollection.Detail Component", () => {
  const pagination = build.pagination();
  const store = build.store();

  const project = build.entity.project("1");
  const collectionResource = build.entity.collectionResource("4", {});
  const resource = build.entity.resource(
    "3",
    {},
    { project, collectionResources: [collectionResource] }
  );
  const collection = build.entity.collection(
    "2",
    {},
    { project, resources: [resource] }
  );
  project.relationships.resources.push(resource);
  const resources = project.relationships.resources;

  const pageChangeMock = jest.fn();
  const filterChangeMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <ResourceCollection.Detail
            project={project}
            slideshowResources={resources}
            slideshowPagination={pagination}
            collectionResources={resources}
            collectionPagination={pagination}
            collectionPaginationHandler={pageChangeMock}
            collection={collection}
            collectionUrl={`/browse/project/${project.id}/collection/${
              collection.id
            }`}
            filterChange={filterChangeMock}
            initialFilterState={null}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
