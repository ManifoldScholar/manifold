import ProjectResources from "../";

describe("frontend/containers/ProjectResources/ProjectResources", () => {
  def("project", () => factory("project"));
  def("resource", () =>
    factory("resource", { relationships: { project: $project } })
  );
  def("resources", () => [$resource]);
  def("pageChange", () => jest.fn());
  def("filterChange", () => jest.fn());
  def("root", () => (
    <ProjectResources
      project={$project}
      resources={$resources}
      meta={{ pagination: fixtures.pagination() }}
      paginationClickHandler={$pageChange}
      filterChange={$filterChange}
      location={{ query: null }}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
