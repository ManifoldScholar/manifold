import { SettingsIntegrationsContainer } from "../Integrations";

describe("backend/containers/settings/Integrations", () => {
  def("settings", () => factory("settings"));
  def("root", () => <SettingsIntegrationsContainer settings={$settings} t={key => key}/>);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
