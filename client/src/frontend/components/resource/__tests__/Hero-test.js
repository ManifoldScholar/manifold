import Hero from "../Hero";

describe("frontend/components/resource/Hero", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Hero resource={$resource} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
