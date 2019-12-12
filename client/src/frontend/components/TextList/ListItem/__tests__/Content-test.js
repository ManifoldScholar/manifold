import Content from "../Content";

describe("frontend/components/TextList/ListItem/Content", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Content
      readUrl="/foo"
      text={$text}
      baseClass={"text-block"}
      showDescriptions
      showSubtitles
      showAuthors
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
