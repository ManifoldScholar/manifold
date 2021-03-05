import UserMenuBody from "../";

describe("global/components/UserMenuBody/UserMenuBody", () => {
  def("hideUserMenu", () => jest.fn());
  def("startLogout", () => jest.fn());
  def("showLoginOverlay", () => jest.fn());
  def("root", () => (
    <UserMenuBody
      hideUserMenu={$hideUserMenu}
      startLogout={$startLogout}
      showLoginOverlay={$showLoginOverlay}
      visible={false}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
