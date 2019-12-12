import Link from "../Link";

describe("reader/components/annotation/Popup/Link", () => {
  def("root", () => (
    <Link
      selectedLink={<a href="www.dailyrowan.com" />}
      annotations={[]}
      showAnnotationsInDrawer={() => {}}
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
