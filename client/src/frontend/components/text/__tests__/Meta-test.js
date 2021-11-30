import Meta from "../Meta";

describe("frontend/components/text/Meta", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Meta text={$text} datesVisible datePrefix={"Added"} publishedVisible />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
