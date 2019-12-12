import Date from "../Date";

describe("global/components/form/Date", () => {
  def("set", () => jest.fn());
  def("root", () => <Date value={"1989-10-10"} label="Some date" set={$set} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
