import SlideShow from "../SlideShow";

describe("frontend/components/resource-list/Slideshow", () => {
  def("resourceCollection", () => factory("resourceCollection"));
  def("collectionResources", () => collectionFactory("collectionResource"));
  def("root", () => (
    <SlideShow
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
