import Video from "../Types/Video";

describe("frontend/components/resource-preview/Video", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Video resource={$resource} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
