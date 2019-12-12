import Resources from "../Resources";

describe("frontend/components/project/Resources", () => {
  def("project", () => factory("project"));
  def("resources", () =>
    collectionFactory("resource", 3, (type, index) => {
      return {
        id: `${type}-${index}`,
        relationships: { project: $project }
      };
    })
  );
  def("paginationClickMock", () => jest.fn());
  def("filterChangeMock", () => jest.fn());
  def("pagination", () => fixtures.pagination());
  def("root", () => (
    <Resources
      project={$project}
      resources={$resources}
      pagination={$pagination}
      paginationClickHandler={$paginationClickMock}
      filterChange={$filterChangeMock}
      initialFilterState={{}}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
