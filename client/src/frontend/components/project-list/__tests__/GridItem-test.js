import GridItem from "../GridItem";

describe("frontend/components/project-list/GridItem", () => {
  def("project", () => factory("project"));
  def("root", () => (
    <GridItem
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
