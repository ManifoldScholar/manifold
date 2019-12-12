import DatePicker from "../DatePicker";

describe("global/components/form/DatePicker", () => {
  def("set", () => jest.fn());
  def("root", () => (
    <DatePicker value={"1989-10-10"} label="Some date" set={$set} />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
