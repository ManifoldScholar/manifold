import List from "../List";

describe("frontend/components/text-list/List", () => {
  def("texts", () => collectionFactory("text"));
  def("root", () => (
    <List
      texts={$texts}
      label="A Label"
      showAuthors
      showDates
      showDescriptions
      showSubtitles
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
