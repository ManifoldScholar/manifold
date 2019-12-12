import { ReaderContainer } from "../";

describe("reader/containers/Reader/Reader", () => {
  def("text", () => factory("text"));
  def("currentUser", () =>
    factory("user", { attributes: { persistentUi: {} } })
  );
  def("textSection", () => factory("textSection"));
  def("route", () => ({
    routes: [
      {
        name: "ReaderSection",
        path: "/read/:textId/section/:sectionId"
      }
    ]
  }));
  def("visibility", () => ({
    visibilityFilters: {},
    uiPanels: {}
  }));
  def("location", () => ({
    pathname: `/read/1/section/2`
  }));
  def("appearance", () => ({
    colors: {},
    typography: {
      fontSize: {},
      margins: {}
    }
  }));
  def("notifications", () => ({
    notifications: []
  }));

  def("root", () => (
    <ReaderContainer
      text={$text}
      section={$textSection}
      route={$route}
      dispatch={$dispatch}
      location={$location}
      visibility={$visibility}
      appearance={$appearance}
      notifications={$notifications}
      authentication={{}}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
