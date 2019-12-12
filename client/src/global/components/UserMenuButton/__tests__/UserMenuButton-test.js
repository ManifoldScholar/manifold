import UserMenuButton from "../";

describe("global/components/UserMenuButton/UserMenuButton", () => {
  def("startLogout", () => jest.fn());
  def("showLoginOverlay", () => jest.fn());
  def("toggleUserMenu", () => jest.fn());
  def("root", () => (
    <UserMenuButton
      startLogout={$startLogout}
      showLoginOverlay={$showLoginOverlay}
      toggleUserMenu={$toggleUserMenu}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
