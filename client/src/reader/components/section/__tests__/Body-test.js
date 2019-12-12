import Body from "../Body";

describe("reader/components/section/Body", () => {
  def("textSection", () => factory("textSection"));
  def("annotations", () => collectionFactory("annotation"));
  def("root", () => (
    <Body
      section={$textSection}
      location={{ hash: "" }}
      annotations={$annotations}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
