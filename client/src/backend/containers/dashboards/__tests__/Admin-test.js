import { DashboardsAdminContainer } from "../Admin";

describe("backend/containers/dashboards/Admin", () => {
  def("project", () => factory("project", { id: 1 }));
  def("projects", () => [$project]);
  def("meta", () => ({ pagination: fixtures.pagination() }));
  def("recentProjects", () => [
    factory("project", { id: 2 }),
    factory("project", { id: 3 })
  ]);
  def("snapshotCreator", () => jest.fn());

  def("root", () => (
    <DashboardsAdminContainer
      entitiesListSearchParams={{ projects: {} }}
      projects={$projects}
      projectsMeta={$meta}
      recentProjects={$recentProjects}
      dispatch={$dispatch}
      projectsListSnapshot={{ page: 1 }}
      snapshotCreator={$snapshotCreator}
      savedSearchPaginationState={() => null}
      authentication={$state.authentication}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root))).toMatchSnapshot();
  });
});
