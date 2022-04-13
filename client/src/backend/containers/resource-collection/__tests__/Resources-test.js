import { ResourceCollectionResourcesContainer } from "../Resources";

describe("backend/containers/resource-collection/Resources", () => {
  def("project", () => factory("project"));
  def("resourceCollection", () =>
    factory("resourceCollection", { relationships: { project: $project } })
  );
  def("resources", () => collectionFactory("resource"));
  def("root", () => (
    <ResourceCollectionResourcesContainer
      resourceCollection={$resourceCollection}
      resources={$resources}
      resourcesMeta={{
        pagination: fixtures.pagination()
      }}
      dispatch={$dispatch}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
