import Link from "../Link";

describe("frontend/components/resource/Link", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Link attributes={$resource.attributes} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
