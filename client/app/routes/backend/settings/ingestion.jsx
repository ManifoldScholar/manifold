import { useOutletContext, useFetcher } from "react-router";
import { useTranslation, Trans } from "react-i18next";
import { settingsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import PageHeader from "backend/components/layout/PageHeader";

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(settingsAPI.update(null, data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function SettingsIngestionRoute() {
  const { t } = useTranslation();
  const settings = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <PageHeader title={t("settings.ingestion.header")} type="settings" />
      <Layout.BackendPanel>
        <FormContainer.Form
          model={settings}
          className="form-secondary"
          fetcher={fetcher}
          notifyOnSuccess={{
            heading: t("notifications.settings_save_success_heading"),
            body: t("notifications.settings_save_success_body")
          }}
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
