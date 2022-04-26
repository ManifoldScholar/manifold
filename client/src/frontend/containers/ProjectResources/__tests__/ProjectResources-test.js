import ProjectResourcesContainer from "../";

describe("frontend/containers/ProjectResources/ProjectResources", () => {
  def("project", () => factory("project"));
  def("root", () => (
      <ProjectResourcesContainer
        project={$project}
        journalBreadcrumbs={[]}
      />
  ));
  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });
});
