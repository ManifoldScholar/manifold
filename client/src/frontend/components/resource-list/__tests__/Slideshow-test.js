import Slideshow from "../Slideshow";

describe("frontend/components/resource-list/Slideshow", () => {
  def("resourceCollection", () => factory("resourceCollection"));
  def("collectionResources", () => collectionFactory("collectionResource"));
  def("root", () => (
    <Slideshow
      collectionResources={$collectionResources}
      resourceCollection={$resourceCollection}
      pagination={fixtures.pagination()}
      count={5}
      dispatch={$dispatch}
      collectionId="1"
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
