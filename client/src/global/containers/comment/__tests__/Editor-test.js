import { CommentEditor } from "../Editor";

describe("global/containers/comment/Editor", () => {
  def("comment", () => factory("comment"));
  def("resource", () => factory("resource"));
  def("cancelMock", () => jest.fn());
  def("user", () => factory("user"));
  def("root", () => (
    <CommentEditor
      dispatch={$dispatch}
      comment={$comment}
      subject={$resource}
      cancel={$cancelMock}
      t={key => key}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
