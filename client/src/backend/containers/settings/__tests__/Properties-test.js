import { SettingsPropertiesContainer } from "../Properties";

describe("backend/containers/settings/Properties", () => {
  def("settings", () => factory("settings"));
  def("root", () => <SettingsPropertiesContainer settings={$settings} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
