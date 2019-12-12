import Deleted from "../";

describe("global/components/comment/deleted", () => {
  def("resource", () => factory("resource"));
  def("comment", () => factory("comment"));
  def("root", () => <Deleted subject={$resource} comment={$comment} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
