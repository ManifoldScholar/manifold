import AddButton from "../AddButton";

describe("backend/components/project-collection/AddButton", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("project", () => factory("project"));
  def("handleAdd", () => jest.fn());
  def("handleRemove", () => jest.fn());

  def("root", () => (
    <AddButton
      projectCollection={$projectCollection}
      selectedProjectIds={[$project.id]}
      project={$project}
      dispatch={$dispatch}
      handleAdd={$handleAdd}
      handleRemove={$handleRemove}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
