import { ProjectsCollectionsContainer } from "../";

describe("frontend/containers/ProjectCollections/ProjectCollections", () => {
  def("projectCollections", () => collectionFactory("projectCollection"));
  def("root", () => (
    <ProjectsCollectionsContainer
      projectCollections={$projectCollections}
      meta={{ pagination: fixtures.pagination() }}
      dispatch={$dispatch}
      authentication={{}}
      match={{ params: {} }}
      fetchData={jest.fn}
      location={{}}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
