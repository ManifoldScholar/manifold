import { HomeContainer } from "../";

describe("frontend/containers/Home/Home", () => {
  def("projects", () => collectionFactory("project"));
  def("featuredProjects", () => collectionFactory("project"));
  def("user", () => factory("user"));
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("root", () => (
    <HomeContainer
      authentication={$authentication}
      projects={$projects}
      fetchData={jest.fn()}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
