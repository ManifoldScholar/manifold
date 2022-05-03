import UserMenuBody from "../";

describe("global/components/UserMenuBody/UserMenuBody", () => {
  def("hideUserMenu", () => jest.fn());
  def("startLogout", () => jest.fn());
  def("showLoginOverlay", () => jest.fn());
  def("root", () => (
    <UserMenuBody
      callbacks={{
        hideUserPanel: $hideUserMenu,
        toggleSignInUpOverlay: $showLoginOverlay,
        logout: $startLogout
      }}
      visible={false}
    />
  ));
  it("matches the snapshot", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
