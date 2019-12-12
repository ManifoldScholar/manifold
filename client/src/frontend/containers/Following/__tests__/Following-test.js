import { FollowingContainer } from "../";

describe("frontend/containers/Following/Following", () => {
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
    <FollowingContainer
      authentication={$authentication}
      featuredProjects={$featuredProjects}
      followedProjects={$followedProjects}
      dispatch={$dispatch}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
