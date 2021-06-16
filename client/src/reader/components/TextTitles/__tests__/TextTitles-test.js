import TextTitles from "../";

describe("reader/components/TextTitles/TextTitles", () => {
  def("text", () => factory("text"));
  def("textSection", () => factory("textSection"));
  def("root", () => (
    <TextTitles
      text={$text}
      section={$textSection}
      showSection
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
