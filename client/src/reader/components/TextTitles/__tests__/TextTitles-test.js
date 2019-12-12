import TextTitles from "../";

describe("reader/components/TextTitles/TextTitles", () => {
  def("root", () => (
    <TextTitles
      textTitle="Rowan: Greatest Dog"
      sectionTitle="Chapter 1"
      showSection
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
