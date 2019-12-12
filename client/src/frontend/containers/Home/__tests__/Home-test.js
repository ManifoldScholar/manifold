import { HomeContainer } from "../";

describe("frontend/containers/Home/Home", () => {
  def("projects", () => collectionFactory("project"));
  def("followedProjects", () => collectionFactory("project"));
  def("featuredProjects", () => collectionFactory("project"));
  def("user", () => {
    const user = factory("user");
    user.favorites = {
      0: factory("project")
    };
  });
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("root", () => (
    <HomeContainer
      authentication={$authentication}
      followedProjects={$followedProjects}
      projects={$projects}
      fetchData={jest.fn()}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
