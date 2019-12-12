import Cards from "../Cards";

describe("frontend/components/resource-list/Cards", () => {
  def("project", () => factory("project"));
  def("resources", () =>
    collectionFactory("resource", 3, (type, index) => {
      return {
        id: `${type}-${index}`,
        relationships: { project: $project }
      };
    })
  );
  def("pageChange", () => jest.fn());
  def("root", () => (
    <Cards
      project={$project}
      resources={$resources}
      pagination={fixtures.pagination()}
      paginationClickHandler={() => $pageChange}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
