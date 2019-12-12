import Spreadsheet from "../Spreadsheet";

describe("backend/components/resource/form/kind/Spreadsheet", () => {
  def("root", () => <Spreadsheet />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
