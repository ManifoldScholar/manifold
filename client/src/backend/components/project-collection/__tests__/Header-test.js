import Header from "../Header";

describe("backend/components/project-collection/Header", () => {
  def("projectCollection", () => factory("projectCollection"));

  def("root", () => <Header projectCollection={$projectCollection} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
