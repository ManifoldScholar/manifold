import { DashboardsAuthorContainer } from "../Author";

describe("backend/containers/dashboards/Author", () => {
  def("project", () => factory("project", { id: 1 }));
  def("projects", () => [$project]);
  def("meta", () => ({ pagination: fixtures.pagination() }));
  def("recentProjects", () => [
    factory("project", { id: 2 }),
    factory("project", { id: 3 })
  ]);
  def("user", () => factory("user"));
  def("root", () => (
    <DashboardsAuthorContainer
      projects={$projects}
      projectsMeta={$meta}
      recentProjects={$recentProjects}
      dispatch={$dispatch}
      currentUser={$user}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($root)).toMatchSnapshot();
  });
});
