import { SettingsIntegrationsContainer } from "../Integrations";

describe("backend/containers/settings/Integrations", () => {
  def("settings", () => factory("settings"));
  def("root", () => <SettingsIntegrationsContainer settings={$settings} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
