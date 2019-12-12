import TextList from "../";

describe("frontend/components/TextList/TextList", () => {
  def("texts", () => collectionFactory("text"));
  def("root", () => (
    <TextList
      texts={$texts}
      label="A Label"
      showAuthors
      showDates
      showDescriptions
      showSubtitles
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
