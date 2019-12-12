import DetailedList from "../DetailedList";

describe("reader/components/notes/DetailedList", () => {
  def("annotations", () => collectionFactory("annotation"));
  def("sortedAnnotations", () => [
    {
      name: "Test",
      sectionId: 1,
      annotations: $annotations
    }
  ]);
  def("clickMock", () => jest.fn());
  def("deleteMock", () => jest.fn());

  def("root", () => (
    <DetailedList
      sortedAnnotations={$sortedAnnotations}
      handleVisitAnnotation={$clickMock}
      handleDeleteAnnotation={$deleteMock}
      loaded
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
