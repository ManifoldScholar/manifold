import { SettingsIntegrationsContainer } from "../Integrations";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/settings/Integrations", () => {
  def("settings", () => factory("settings"));
  def("root", () => (
    <BreadcrumbsProvider>
      <SettingsIntegrationsContainer settings={$settings} t={key => key}/>
      </BreadcrumbsProvider>
    ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
