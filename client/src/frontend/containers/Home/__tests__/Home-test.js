import HomeContainer from "../";

describe("frontend/containers/Home/Home", () => {
  def("projects", () => collectionFactory("project"));
  def("featuredProjects", () => collectionFactory("project"));
  def("user", () => factory("user"));
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("root", () => (
    <HomeContainer
      projects={$projects}
    />
  ));

  it("matches the snapshot", () => {
    expect(render($withApp($root))).toMatchSnapshot();
  });
});
