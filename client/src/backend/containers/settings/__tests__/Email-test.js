import { SettingsEmailContainer } from "../Email";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/settings/Email", () => {
  def("settings", () => factory("settings"));
  def("isSendmail", () => name => "sendmail");
  def("isSmtp", () => name => "smtp");
  def("root", () => (
    <BreadcrumbsProvider>
      <SettingsEmailContainer
        dispatch={() => {}}
        settings={$settings}
        form={$formMock}
        t={key => key}
      />
    </BreadcrumbsProvider>
  ));

  describe("when delivery method is smtp", () => {
    def("formMock", () => ({ getModelValue: $isSmtp }));

    it("matches the snapshot when rendered", () => {
      expect(mount($withApp($root)).html()).toMatchSnapshot();
    });
  });

  describe("when delivery method is sendmail", () => {
    def("formMock", () => ({ getModelValue: $isSendmail }));

    it("matches the snapshot when rendered", () => {
      expect(mount($withApp($root)).html()).toMatchSnapshot();
    });
  });
});
