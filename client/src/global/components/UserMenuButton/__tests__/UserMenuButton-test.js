import UserMenuButton from "../";

describe("global/components/UserMenuButton/UserMenuButton", () => {
  def("toggleSignInUpOverlay", () => jest.fn());
  def("toggleUserPanel", () => jest.fn());
  def("root", () => (
    <UserMenuButton
      callbacks={{
        toggleUserPanel: $toggleUserPanel,
        toggleSignInUpOverlay: $toggleSignInUpOverlay
      }}
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
