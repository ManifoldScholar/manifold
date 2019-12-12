import { FeaturedContainer } from "../";

describe("frontend/containers/Featured/Featured", () => {
  def("projects", () => collectionFactory("project"));
  def("authentication", () => fixtures.authentication());
  def("root", () => (
    <FeaturedContainer
      authentication={$authentication}
      featuredProjects={$projects}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
