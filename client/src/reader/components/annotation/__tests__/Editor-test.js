import AnnotationEditor from "global/components/Annotation/Editor/index.js";

describe("reader/components/annotation/Editor", () => {
  def("annotation", () => factory("annotation"));
  def("cancelMock", () => jest.fn());
  def("saveMock", () => jest.fn());
  def("root", () => (
    <AnnotationEditor
      subject={$annotation.attributes.subject}
      startChar={$annotation.attributes.startChar}
      endChar={$annotation.attributes.endChar}
      startNode={$annotation.attributes.startNode}
      endNode={$annotation.attributes.endNode}
      cancel={$cancelMock}
      saveAnnotation={$saveMock}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($withApp($root))).toMatchSnapshot();
  });
});
