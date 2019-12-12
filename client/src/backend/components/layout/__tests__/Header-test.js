import Header from "../Header";

describe("Backend.Layout.Header component", () => {
  def("settings", () => factory("settings"));
  def("currentUser", () => factory("user"));
  def("toggleSignInUpOverlay", () => jest.fn());
  def("toggleUserPanel", () => jest.fn());
  def("logout", () => jest.fn());
  def("root", () => (
    <Header
      authentication={{
        authenticated: true,
        currentUser: $currentUser
      }}
      notifications={{ notifications: {} }}
      location={{}}
      visibility={{ uiPanels: {} }}
      settings={$settings}
      commonActions={{
        toggleSignInUpOverlay: $toggleSignInUpOverlay,
        toggleUserPanel: $toggleUserPanel,
        logout: $logout
      }}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
