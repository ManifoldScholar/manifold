import Section from "reader/components/section";

describe("reader/components/section/NextSection", () => {
  def("sectionsMap", () => [
    { id: "1234-5678-9000", name: "First Section" },
    { id: "2345-5678-1111", name: "Second Section" }
  ]);
  def("text", () => factory("text"));
  def("typography", () => ({
    margins: [0, 1, 2]
  }));
  def("root", () => (
    <Section.NextSection
      sectionId="1234-5678-9000"
      sectionsMap={$sectionsMap}
      text={$text}
      typography={$typography}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
