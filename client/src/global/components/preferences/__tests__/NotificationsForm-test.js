import NotificationsForm from "../NotificationsForm";

describe("global/components/preferences/NotificationsForm", () => {
  def("preferences", () => ({
    digest: "daily",
    projects: "always",
    followedProjects: "never",
    annotationsAndComments: "never",
    repliesToMe: "never"
  }));
  def("changeHandler", () => jest.fn());
  def("digestProjectsChangeHandler", () => jest.fn());
  def("unsubscribeAllHandler", () => jest.fn());
  def("root", () => (
    <NotificationsForm
      preferences={$preferences}
      changeHandler={$changeHandler}
      digestProjectsChangeHandler={$digestProjectsChangeHandler}
      unsubscribeAllHandler={$unsubscribeAllHandler}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
