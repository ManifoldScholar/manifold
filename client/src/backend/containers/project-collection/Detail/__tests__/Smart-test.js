import Smart from "../Smart";

describe("backend/containers/project-collection/Detail/Smart", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("projects", () => collectionFactory("project"));
  def("root", () => (
    <Smart projectCollection={$projectCollection} projects={$projects} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
