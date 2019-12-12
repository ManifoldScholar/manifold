import Meta from "../Meta";

describe("frontend/components/TextList/ListItem/Meta", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Meta
      text={$text}
      baseClass={"text-block"}
      datesVisible
      datePrefix={"Added"}
      publishedVisible
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
