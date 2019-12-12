import SlideImage from "../SlideImage";

describe("frontend/components/resource-slide/SlideImage", () => {
  def("resource", () => factory("resource"));
  def("root", () => <SlideImage resource={$resource} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
