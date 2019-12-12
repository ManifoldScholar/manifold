import Loading from "../Loading";

describe("frontend/components/resource-slide/Loading", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Loading resource={$resource} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
