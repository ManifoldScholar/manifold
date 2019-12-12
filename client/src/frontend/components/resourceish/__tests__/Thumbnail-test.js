import Thumbnail from "../Thumbnail";

describe("frontend/components/resourceish/Thumbnail", () => {
  def("resource", () => factory("resource"));
  def("root", () => (
    <Thumbnail resourceish={$resource} projectId="1" showkind showtitle />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
