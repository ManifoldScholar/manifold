import Label from "../Label";

describe("reader/components/section/Label", () => {
  def("root", () => <Label label={"Hip Hop Classics"} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
