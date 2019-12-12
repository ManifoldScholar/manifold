import Pdf from "../Pdf";

describe("backend/components/resource/form/kind/Pdf", () => {
  def("root", () => <Pdf />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
