import Grid from "../Grid";

describe("frontend/components/project-list/Grid", () => {
  def("projects", () => collectionFactory("project"));
  def("root", () => (
    <Grid
      limit={1}
      dispatch={$dispatch}
      projects={$projects}
      authenticated
      favorites={{}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
