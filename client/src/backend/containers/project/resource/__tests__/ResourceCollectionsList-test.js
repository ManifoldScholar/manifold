import { ProjectResourceCollectionsListContainer } from "../ResourceCollectionsList";

describe("backend/containers/project/resource/ResourceCollectionsList", () => {
  def("pagination", () => fixtures.pagination());
  def("project", () => factory("project"));
  def("resourceCollections", () => [
    factory("resourceCollection", { id: "resource-collection-1" }),
    factory("resourceCollection", { id: "resource-collection-2" }),
    factory("resourceCollection", { id: "resource-collection-3" })
  ]);

  def("root", () => (
    <ProjectResourceCollectionsListContainer
      project={$project}
      resourceCollections={$resourceCollections}
      resourceCollectionsMeta={{
        pagination: $pagination
      }}
      dispatch={$dispatch}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
