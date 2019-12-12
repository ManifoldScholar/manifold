import { SubscriptionsContainer } from "../";

describe("frontend/containers/Subscriptions", () => {
  def("notificationPreferences", () => ({
    digest: "daily",
    followedProjects: "always",
    annotationsAndComments: "always",
    repliesToMe: "always"
  }));
  def("user", () =>
    factory("user", {
      attributes: { notificationPreferences: $notificationPreferences }
    })
  );
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("root", () => (
    <SubscriptionsContainer
      authentication={$authentication}
      dispatch={$dispatch}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
