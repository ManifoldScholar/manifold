import Meta from "../Meta";

describe("frontend/components/resource/Meta", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Meta resource={$resource} showIcon showTags />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
