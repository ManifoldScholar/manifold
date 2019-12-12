import { NotationResourceCollectionDetailContainer } from "../Detail";

describe("reader/containers/notation/resource-collection/Detail", () => {
  def("resourceCollection", () => factory("resourceCollection"));
  def("resource", () => factory("resource"));
  def("resources", () => collectionFactory("resource"));
  def("meta", () => ({ pagination: fixtures.pagination() }));
  def("handleClose", () => jest.fn());
  def("root", () => (
    <NotationResourceCollectionDetailContainer
      resourceCollection={$resourceCollection}
      slideshowResources={$resources}
      slideshowResourcesMeta={$meta}
      history={fixtures.history()}
      match={{ params: { textId: "2", sectionId: "3" } }}
      handleClose={$handleClose}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
