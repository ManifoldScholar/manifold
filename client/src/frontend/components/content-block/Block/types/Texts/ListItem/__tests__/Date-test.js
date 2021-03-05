import Date from "../Date";

describe("frontend/components/TextList/ListItem/Date", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Date
      date={$text.attributes.createdAt}
      datePrefix={"Added"}
      baseClass={"text-block"}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
