import FilteredList from "../FilteredList";

describe("reader/components/notes/FilteredList", () => {
  def("annotations", () => collectionFactory("annotation"));
  def("sortedAnnotations", () => [
    {
      name: "Test",
      sectionId: 1,
      annotations: $annotations
    }
  ]);
  def("textSection", () => factory("textSection"));
  def("clickMock", () => jest.fn());
  def("filter", () => ({ formats: ["highlight", "annotation", "bookmark"] }));
  def("root", () => (
    <FilteredList
      sortedAnnotations={$sortedAnnotations}
      handleSeeAllClick={$clickMock}
      handleFilterChange={$clickMock}
      section={$textSection}
      filter={$filter}
      loaded
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
