import AllLink from "../AllLink";

describe("frontend/components/event/AllLink", () => {
  def("project", () => factory("project"));
  def("root", () => <AllLink threshold={3} entity={$project} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
