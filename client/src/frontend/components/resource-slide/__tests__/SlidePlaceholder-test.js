import SlidePlaceholder from "../SlidePlaceholder";

describe("frontend/components/resource-slide/SlidePlaceholder", () => {
  def("root", () => <SlidePlaceholder />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
