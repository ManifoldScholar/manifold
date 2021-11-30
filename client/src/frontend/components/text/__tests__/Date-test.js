import Date from "../Date";

describe("frontend/components/text/Date", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Date date={$text.attributes.createdAt} datePrefix={"Added"} />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
