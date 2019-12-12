import LoadingBar from "../";

describe("global/components/LoadingBar/LoadingBar", () => {
  def("root", () => <LoadingBar loading />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
