import Manual from "../Manual";

describe("backend/containers/project-collection/Detail/Manual", () => {
  def("projects", () => collectionFactory("project"));
  def("projectCollection", () =>
    factory("projectCollection", { attributes: { manuallySorted: false } })
  );
  def("collectionProjects", () => collectionFactory("collectionProject"));
  def("root", () => (
    <Manual
      projectCollection={$projectCollection}
      collectionProjects={$collectionProjects}
      orderChangeHandler={() => jest.fn()}
      projects={$projects}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
