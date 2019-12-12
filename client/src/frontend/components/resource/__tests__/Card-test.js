import Card from "../Card";

describe("frontend/components/resource/Card", () => {
  def("project", () => factory("project"));
  def("resource", () => factory("resource"));
  def("root", () => <Card resource={$resource} project={$project} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
