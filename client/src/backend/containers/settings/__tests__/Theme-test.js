import { SettingsThemeContainer } from "../Theme";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/settings/Theme", () => {
  def("settings", () => factory("settings"));
  def("root", () => (
    <BreadcrumbsProvider>
      <SettingsThemeContainer settings={$settings} t={key => key} />
    </BreadcrumbsProvider>
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
