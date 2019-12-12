import { AnnotationList } from "../List";

describe("reader/containers/annotation/List", () => {
  def("annotations", () => collectionFactory("annotation"));
  def("annotationIds", () => $annotations.map(a => a.id));
  def("createHandler", () => jest.fn());
  def("loginHandler", () => jest.fn());

  def("root", () => (
    <AnnotationList
      annotations={$annotations}
      annotationIds={$annotationIds}
      createHandler={$createHandler}
      loginHandler={$loginHandler}
      dispatch={$dispatch}
    />
  ));

  xit("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
