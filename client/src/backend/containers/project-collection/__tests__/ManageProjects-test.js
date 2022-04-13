import { ProjectCollectionManageProjects } from "../ManageProjects";

describe("backend/containers/project-collection/ManageProjects", () => {
  def("project", () => factory("project"));
  def("projectCollection", () => factory("projectCollection"));
  def("collectionProjects", () => collectionFactory("collectionProject"));
  def("projects", () => collectionFactory("project"));
  def("pagination", () => fixtures.pagination());
  def("root", () => (
    <ProjectCollectionManageProjects
      dispatch={$dispatch}
      projectCollection={$projectCollection}
      collectionProjects={$collectionProjects}
      projects={$projects}
      projectsMeta={{ pagination: $pagination }}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
