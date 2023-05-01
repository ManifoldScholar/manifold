import { SettingsPropertiesContainer } from "../Properties";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/settings/Properties", () => {
  def("settings", () => factory("settings"));
  def("root", () => (
    <BreadcrumbsProvider>
      <SettingsPropertiesContainer settings={$settings} t={key => key} />
      </BreadcrumbsProvider>
    ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
