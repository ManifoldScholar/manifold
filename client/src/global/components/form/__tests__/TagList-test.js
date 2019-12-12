import TagList from "../TagList";

describe("global/components/form/TagList", () => {
  def("root", () => <TagList label="Tags" name="attributes[tags]" />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
