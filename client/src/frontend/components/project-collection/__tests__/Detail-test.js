import Detail from "../Detail";

describe("frontend/components/project-collection/Detail", () => {
  def("projects", () => collectionFactory("project"));
  def("projectCollection", () =>
    factory("projectCollection", { relationships: { projects: $projects } })
  );

  def("root", () => (
    <Detail
      projectCollection={$projectCollection}
      projects={$projects}
      pagination={fixtures.pagination()}
      paginationClickHandler={jest.fn}
      filterChangeHandler={jest.fn}
      authentication={{}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
