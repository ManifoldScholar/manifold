import Hero from "../Hero";

describe("frontend/components/project/Hero", () => {
  def("project", () => factory("project"));
  def("root", () => <Hero project={$project} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
