import ProjectCover from "../ProjectCover";

describe("backend/components/project-collection/ProjectCover", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("project", () => factory("project"));
  def("addHandler", () => jest.fn());
  def("removeHandler", () => jest.fn());

  def("root", () => (
    <ProjectCover
      projectCollection={$projectCollection}
      entity={$project}
      addHandler={$addHandler}
      removeHandler={$removeHandler}
      addable
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
