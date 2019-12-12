import Totals from "../Totals";

describe("frontend/components/resource-list/Totals", () => {
  def("project", () => factory("project"));
  def("root", () => <Totals count={3} project={$project} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
