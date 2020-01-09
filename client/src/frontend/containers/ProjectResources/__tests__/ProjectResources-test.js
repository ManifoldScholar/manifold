import { ProjectResourcesContainer } from "../";

describe("frontend/containers/ProjectResources/ProjectResources", () => {
  def("project", () => factory("project"));
  def("resource", () =>
    factory("resource", { relationships: { project: $project } })
  );
  def("settings", () => factory("settings"));
  def("resources", () => [$resource]);
  def("pageChange", () => jest.fn());
  def("filterChange", () => jest.fn());
  def("root", () => (
    <ProjectResourcesContainer
      project={$project}
      resources={$resources}
      meta={{ pagination: fixtures.pagination() }}
      paginationClickHandler={$pageChange}
      filterChange={$filterChange}
      location={{ query: null }}
      settings={$settings}
      dispatch={$dispatch}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
