import Grid from "../Grid";

describe("frontend/components/resource-collection-list/Grid", () => {
  def("resourceCollections", () => collectionFactory("resourceCollection"));
  def("project", () => factory("project"));
  def("root", () => (
    <Grid project={$project} resourceCollections={$resourceCollections} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
