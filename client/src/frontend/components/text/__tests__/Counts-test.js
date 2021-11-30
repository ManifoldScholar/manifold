import Counts from "../Counts";

describe("frontend/components/text/Counts", () => {
  def("text", () => factory("text"));
  def("root", () => <Counts text={$text} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
