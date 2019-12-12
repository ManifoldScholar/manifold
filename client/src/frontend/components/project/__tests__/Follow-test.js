import Follow from "../Follow";

describe("frontend/components/project/Following", () => {
  def("project", () => factory("project"));
  def("root", () => (
    <Follow
      dispatch={$dispatch}
      project={$project}
      favorites={{}}
      authenticated
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
