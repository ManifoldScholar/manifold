import { NotificationsComponent } from "../";

describe("global/containers/Notifications/Notifications", () => {
  def("notifications", () => ({
    notifications: [
      {
        id: "A_NOTIFICATION_1",
        level: 2,
        heading: "A Heading",
        body: "The body.",
        scope: "global"
      },
      {
        id: "A_NOTIFICATION_2",
        level: 2,
        heading: "A Heading",
        body: "The body.",
        scope: "drawer"
      }
    ]
  }));

  def("root", () => (
    <NotificationsComponent
      notifications={$notifications}
      scope="global"
      dispatch={$dispatch}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
