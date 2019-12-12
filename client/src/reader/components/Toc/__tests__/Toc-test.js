import Toc from "../";

describe("reader/components/Toc/Toc", () => {
  def("text", () => factory("text"));
  def("hideTocMock", () => jest.fn());
  def("root", () => (
    <Toc text={$text} tocDrawerVisible hideTocDrawer={$hideTocMock} />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  context("when the text does not have a TOC", () => {
    def("text", () => factory("text", { attributes: { toc: [] } }));
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });
});
