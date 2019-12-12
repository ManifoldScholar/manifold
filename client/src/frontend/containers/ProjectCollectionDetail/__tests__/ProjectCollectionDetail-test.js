import { ProjectCollectionDetailContainer } from "../";

describe("frontend/containers/ProjectCollectionDetail/ProjectCollectionDetail", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("projects", () => collectionFactory("project"));
  def("settings", () => factory("settings"));
  def("root", () => (
    <ProjectCollectionDetailContainer
      projectCollection={$projectCollection}
      projects={$projects}
      projectsMeta={{ pagination: fixtures.pagination() }}
      dispatch={$dispatch}
      settings={$settings}
      authentication={{}}
      match={{ params: {} }}
      location={{}}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
