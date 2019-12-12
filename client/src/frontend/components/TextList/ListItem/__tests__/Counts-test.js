import Counts from "../Counts";

describe("frontend/components/TextList/ListItem/Counts", () => {
  def("text", () => factory("text"));
  def("root", () => <Counts text={$text} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
