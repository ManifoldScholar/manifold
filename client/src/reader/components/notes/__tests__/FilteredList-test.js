import { collectionFactory } from "../../../../test/fixtures/factory";
import FilteredList from "../FilteredList";

const DEFAULT_FORMATS = ["highlight", "annotation", "bookmark"];

describe("reader/components/notes/FilteredList", () => {
  def("annotations", () => collectionFactory("annotation"));
  def("sortedAnnotations", () => [
    {
      name: "Test",
      id: 1,
      annotations: $annotations
    }
  ]);
  def("textSection", () => factory("textSection"));
  def("clickMock", () => jest.fn());
  def("filters", () => ({ formats: DEFAULT_FORMATS }));
  def("root", () => (
    <FilteredList
      sortedAnnotations={$sortedAnnotations}
      handleSeeAllClick={$clickMock}
      handleFilterChange={$clickMock}
      section={$textSection}
      filters={$filters}
      defaultFormats={DEFAULT_FORMATS}
      readingGroups={[]}
      annotated
      loaded
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
