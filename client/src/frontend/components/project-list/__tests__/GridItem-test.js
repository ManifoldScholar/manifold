import ProjectGridItem from "../../grid-list-items/ProjectGridItem";

describe("frontend/components/grid-list-items/ProjectGridItem", () => {
  def("project", () => factory("project"));
  def("root", () => (
    <ProjectGridItem
      children={null}
      dispatch={$dispatch}
      project={$project}
      favorites={{}}
      authenticated
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
