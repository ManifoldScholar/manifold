import { ResourceCollectionDetailContainer } from "../";

describe("frontend/containers/ResourceCollectionDetail", () => {
  def("settings", () => factory("settings"));
  def("project", () => factory("project"));
  def("resources", () => collectionFactory("resource"));
  def("resourceCollection", () => factory("resourceCollection"));
  def("meta", () => ({ pagination: fixtures.pagination() }));
  def("mock", () => jest.fn());

  def("root", () => (
    <ResourceCollectionDetailContainer
      dispatch={$dispatch}
      settings={$settings}
      project={$project}
      resources={$resources}
      resourceCollection={$resourceCollection}
      params={{ id: "2" }}
      resourcesMeta={$meta}
      slideshowResources={$resources}
      slideshowResourcesMeta={$meta}
      collectionResources={$resources}
      resourceCollectionPagination={fixtures.pagination()}
      resourceCollectionPaginationHandler={$mock}
      filterChange={$mock}
      resourceCollectionUrl={`/browse/project/${$project.id}/collection/${$resourceCollection.id}`}
      location={{ query: null }}
      t={key => key}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
