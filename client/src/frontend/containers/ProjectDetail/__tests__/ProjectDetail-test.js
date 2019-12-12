import ProjectDetailContainer from "../";

describe("frontend/containers/ProjectDetail/ProjectDetail", () => {
  def("project", () => factory("project"));
  def("settings", () => factory("settings"));
  def("root", () => (
    <ProjectDetailContainer
      dispatch={$dispatch}
      project={$project}
      settings={$settings}
      projectResponse={{}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
