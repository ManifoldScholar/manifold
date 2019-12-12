import Slide from "../Slide";

describe("frontend/components/resource-slide/Slide", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Slide resource={$resource} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
