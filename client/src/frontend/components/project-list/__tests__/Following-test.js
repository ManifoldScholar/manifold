import Following from "../Following";

describe("frontend/components/project-list/Following", () => {
  def("projects", () => collectionFactory("project"));
  def("favorites", () => ({
    1: $projects[0],
    2: $projects[1]
  }));
  def("user", () => factory("user"));
  def("update", () => jest.fn());
  def("root", () => (
    <Following
      dispatch={$dispatch}
      followedProjects={$projects}
      authentication={{
        currentUser: $user
      }}
      handleUpdate={$update}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
