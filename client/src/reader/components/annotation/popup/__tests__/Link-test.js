import FollowLink from "../menus/FollowLink";

describe("reader/components/annotation/popup/menus/FollowLink", () => {
  def("root", () => (
    <FollowLink
      activeEvent={{ link: { href: "www.dailyrowan.com" }, annotationIds: [] }}
      actions={{ openViewAnnotationsDrawer: () => {} }}
      menu={{ id: "ABCD" }}
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
