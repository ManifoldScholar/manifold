import TableOfContents from "../TableOfContents";

describe("backend/components/content-block/TypeForm/types/TableOfContents", () => {
  def("project", () => factory("project"));
  def("contentBlock", () => factory("contentBlock"));

  def("root", () => (
    <TableOfContents
      contentBlock={$contentBlock}
      project={$project}
      setOther={jest.fn}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
