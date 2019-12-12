import { BackendContainer } from "../";

describe("backend/containers/Backend/index", () => {
  def("settings", () => factory("settings"));
  def("root", () => (
    <BackendContainer
      history={fixtures.history()}
      notifications={$state.notifications}
      authentication={$state.authentication}
      route={{ routes: [] }}
      visibility={$state.ui.transitory.visibility}
      settings={$settings}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render to null", () => {
    expect(render($withApp($root))).not.toBeNull();
  });
});
