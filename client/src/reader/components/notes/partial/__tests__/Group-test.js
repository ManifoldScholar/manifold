import Group from "../Group";

describe("reader/components/notes/partial/Group", () => {
  def("annotations", () => collectionFactory("annotation"));
  def("textSection", () => factory("textSection"));
  def("root", () => (
    <Group
      sectionName="Test"
      readerSection={$textSection}
      annotations={$annotations}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
