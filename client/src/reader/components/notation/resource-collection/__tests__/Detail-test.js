import Detail from "../Detail";

describe("reader/components/notation/resource-collection/Detail", () => {
  def("project", () => factory("project"));
  def("resources", () => collectionFactory("resource"));
  def("pageChangeMock", () => jest.fn());
  def("resourceCollection", () => factory("resourceCollection"));
  def("filterChangeMock", () => jest.fn());
  def("closeMock", () => jest.fn());

  def("root", () => (
    <Detail
      project={$project}
      slideshowResources={$resources}
      slideshowPagination={fixtures.pagination()}
      collectionResources={$resources}
      resourceCollectionPagination={fixtures.pagination()}
      resourceCollectionPaginationHandler={$pageChangeMock}
      resourceCollection={$resourceCollection}
      filterChange={$filterChangeMock}
      handleClose={$closeMock}
      initialFilterState={null}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
