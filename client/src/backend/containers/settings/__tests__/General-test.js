import { SettingsGeneralContainer } from "../General";

describe("backend/containers/settings/General", () => {
  def("settings", () => factory("settings"));
  def("root", () => <SettingsGeneralContainer settings={$settings} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
