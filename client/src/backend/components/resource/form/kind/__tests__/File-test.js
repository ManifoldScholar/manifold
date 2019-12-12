import File from "../File";

describe("backend/components/resource/form/kind/File", () => {
  def("root", () => <File />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
