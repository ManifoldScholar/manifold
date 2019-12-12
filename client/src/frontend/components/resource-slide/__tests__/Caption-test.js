import Caption from "../Caption";

describe("frontend/components/resource-slide/Caption", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Caption resource={$resource} collectionId={1} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
