import { SettingsThemeContainer } from "../Theme";

describe("backend/containers/settings/Theme", () => {
  def("settings", () => factory("settings"));
  def("root", () => <SettingsThemeContainer settings={$settings} t={key => key} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
