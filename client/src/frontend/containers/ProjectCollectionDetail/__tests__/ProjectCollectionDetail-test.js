import ProjectCollectionDetailContainer from "../";

describe("frontend/containers/ProjectCollectionDetail/ProjectCollectionDetail", () => {
  def("root", () => <ProjectCollectionDetailContainer />);
  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });
});
