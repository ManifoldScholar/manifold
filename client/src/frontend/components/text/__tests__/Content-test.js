import Content from "../Content";

describe("frontend/components/text/Content", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Content
      readUrl="/foo"
      text={$text}
      showDescriptions
      showSubtitles
      showAuthors
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
