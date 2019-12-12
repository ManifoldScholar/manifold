import { FrontendContainer } from "../";

describe("frontend/containers/Frontend/Frontend", () => {
  def("notifications", () => ({ notifications: [] }));
  def("settings", () => factory("settings"));
  def("root", () => (
    <FrontendContainer
      notifications={$notifications}
      history={fixtures.history()}
      route={{ routes: [] }}
      location={{}}
      visibility={$state.ui.transitory.visibility}
      authentication={fixtures.authentication()}
      settings={$settings}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
