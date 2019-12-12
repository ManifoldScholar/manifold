import Presentation from "../Presentation";

describe("backend/components/resource/form/kind/Presentation", () => {
  def("root", () => <Presentation />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
