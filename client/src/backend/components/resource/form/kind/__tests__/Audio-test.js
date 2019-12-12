import Audio from "../Audio";

describe("backend/components/resource/form/kind/Audio", () => {
  def("root", () => <Audio />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
