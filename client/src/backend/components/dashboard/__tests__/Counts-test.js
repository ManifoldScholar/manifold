import Counts from "../Counts";

describe("backend/components/dashboard/Counts", () => {
  def("stats", () => factory("statistics"));
  def("root", () => <Counts statistics={$stats} />);

  it("matches the snapshot", () => {
    expect(render($root)).toMatchSnapshot();
  });
});
