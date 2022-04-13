import Bibliographic from "../Bibliographic";

describe("frontend/components/text/Bibliographic", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Bibliographic
      readUrl="/foo"
      datePrefix={"Added"}
      date="2020-02-20"
      text={$text}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
