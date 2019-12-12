import Meta from "../";

describe("global/components/comment/meta", () => {
  def("creator", () => factory("user"));
  def("comment", () => factory("comment"));
  def("root", () => <Meta creator={$creator} comment={$comment} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
