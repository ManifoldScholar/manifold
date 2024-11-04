import ProjectsCollectionsContainer from "../";

describe("frontend/containers/ProjectCollections/ProjectCollections", () => {
  def("root", () => <ProjectsCollectionsContainer />);
  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });
});
