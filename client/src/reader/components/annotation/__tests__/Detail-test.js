import AnnotationDetail from "global/components/Annotation/Annotation/UserContent/index.js";

describe("reader/components/annotation/Detail", () => {
  def("annotation", () => factory("annotation"));
  def("showLogin", () => jest.fn());
  def("root", () => (
    <AnnotationDetail annotation={$annotation} showLogin={$showLogin} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($withApp($root))).toMatchSnapshot();
  });
});
