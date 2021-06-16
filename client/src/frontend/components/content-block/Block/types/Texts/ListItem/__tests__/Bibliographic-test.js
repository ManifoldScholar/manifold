import Bibliographic from "../Bibliographic";

describe("frontend/components/TextList/ListItem/Bibliographic", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Bibliographic
      readUrl="/foo"
      baseClass={"text-block"}
      datePrefix={"Added"}
      text={$text}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
