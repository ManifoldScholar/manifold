import ProjectCategoryNewContainer from "../New";

describe("backend/containers/project/category/New", () => {
  def("project", () => factory("project"));
  def("root", () => <ProjectCategoryNewContainer project={$project} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
