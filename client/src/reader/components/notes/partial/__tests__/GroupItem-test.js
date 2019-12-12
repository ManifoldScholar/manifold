import GroupItem from "../GroupItem";

describe("reader/components/notes/partial/GroupItem", () => {
  def("annotation", () => factory("annotation"));
  def("root", () => <GroupItem annotation={$annotation} />);
  it("matches the snapshot", () => {
    expect(shallow($withApp($root))).toMatchSnapshot();
  });
});
