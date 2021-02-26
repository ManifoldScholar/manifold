import Bibliographic from "../Bibliographic";

describe("frontend/components/TextList/ListItem/Bibliographic", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Bibliographic
      readUrl="/foo"
      baseClass={"text-block"}
      description={$text.attributes.description}
      subtitle={$text.attributes.subtitle}
      date={$text.attributes.createdAt}
      datePrefix={"Added"}
      title={$text.attributes.title}
      creatorNames={$text.attributes.creatorNames}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
