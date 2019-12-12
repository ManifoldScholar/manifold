jest.mock("react-collapse");

import ResourceCollection from "frontend/components/resource-collection";

describe("frontend/components/resource-collection/Detail", () => {
  def("project", () => factory("project"));
  def("collectionResources", () => collectionFactory("collectionResource"));
  def("resource", () =>
    factory("resource", {
      relationships: {
        project: $project,
        collectionResources: $collectionResources
      }
    })
  );
  def("resources", () => [$resource]);
  def("resourceCollection", () =>
    factory("resourceCollection", {
      relationships: { project: $project, resources: $resources }
    })
  );
  def("pageChange", () => jest.fn());
  def("filterChange", () => jest.fn());
  def("root", () => (
    <ResourceCollection.Detail
      project={$project}
      slideshowResources={$resources}
      slideshowPagination={fixtures.pagination()}
      collectionResources={$collectionResources}
      resourceCollectionPagination={fixtures.pagination()}
      resourceCollectionPaginationHandler={$pageChange}
      resourceCollection={$resourceCollection}
      resourceCollectionUrl={`/browse/project/${$project.id}/collection/${$resourceCollection.id}`}
      filterChange={$filterChange}
      initialFilterState={null}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
