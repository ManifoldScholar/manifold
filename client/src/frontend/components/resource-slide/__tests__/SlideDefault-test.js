import SlideDefault from "../SlideDefault";

describe("frontend/components/resource-slide/SlideDefault", () => {
  def("resource", () => factory("resource"));
  def("root", () => <SlideDefault resource={$resource} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
