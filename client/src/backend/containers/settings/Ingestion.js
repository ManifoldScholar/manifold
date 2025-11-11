import { useTranslation, Trans } from "react-i18next";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, requests } from "api";
import { useFromStore } from "hooks";
import PageHeader from "backend/components/layout/PageHeader";

export default function SettingsIngestionContainer() {
  const { t } = useTranslation();
  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });

  if (!settings) return null;
  return (
    <section>
      <PageHeader title={t("settings.ingestion.header")} type="settings" />
      <Layout.BackendPanel>
        <FormContainer.Form
          model={settings}
          name="backend-settings"
          update={settingsAPI.update}
          create={settingsAPI.update}
          className="form-secondary"
        >
          <Form.CodeArea
            focusOnMount
            label={t("settings.ingestion.global_styles_label")}
            mode="css"
            name="attributes[ingestion][globalStyles]"
            instructions={t("settings.ingestion.global_styles_instructions")}
          />
          <Form.CodeArea
            label={t("settings.ingestion.mammoth_style_label")}
            name="attributes[ingestion][mammothStyleMap]"
            mode="text"
            instructions={
              <Trans
                i18nKey="settings.ingestion.mammoth_style_instructions"
                components={[
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.npmjs.com/package/mammoth#writing-style-maps"
                  >
                    #
                  </a>
                ]}
              />
            }
          />
          <Form.Save text={t("settings.save")} />
        </FormContainer.Form>
      </Layout.BackendPanel>
    </section>
  );
}
