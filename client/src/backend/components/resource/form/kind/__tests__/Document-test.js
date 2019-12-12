import Document from "../Document";

describe("backend/components/resource/form/kind/Document", () => {
  def("root", () => <Document />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
