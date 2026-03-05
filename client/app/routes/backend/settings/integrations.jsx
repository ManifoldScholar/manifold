import { useOutletContext, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
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

export default function SettingsIntegrationsRoute() {
  const { t } = useTranslation();
  const settings = useOutletContext();
  const fetcher = useFetcher();

  return (
    <div>
      <PageHeader title={t("settings.integrations.header")} type="settings" />
      <Layout.BackendPanel>
        <FormContainer.Form
          model={settings}
          className="form-secondary"
          fetcher={fetcher}
        >
          <Form.FieldGroup label={t("settings.integrations.google_header")}>
            <Form.Upload
              layout="square"
              accepts="json"
              label={t("settings.integrations.google_config_label")}
              name="attributes[googleService]"
              wide
            />
            <Form.TextArea
              label={t("settings.integrations.google_key_label")}
              wide
              name="attributes[secrets][googlePrivateKey]"
            />
            <Form.TextInput
              label={t("settings.integrations.google_project_label")}
              name="attributes[integrations][googleProjectId]"
            />
            <Form.TextInput
              label={t("settings.integrations.google_key_id_label")}
              name="attributes[integrations][googlePrivateKeyId]"
            />
            <Form.TextInput
              label={t("settings.integrations.google_client_email_label")}
              name="attributes[integrations][googleClientEmail]"
            />
            <Form.TextInput
              label={t("settings.integrations.google_client_id_label")}
              name="attributes[integrations][googleClientId]"
            />
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("settings.integrations.google_analytics_header")}
          >
            <Form.TextInput
              label={t("settings.integrations.google_tracking_id_label")}
              name="attributes[integrations][gaFourTrackingId]"
              placeholder="G-0000000000"
            />
          </Form.FieldGroup>
          <Form.Save text={t("settings.save")} />
        </FormContainer.Form>
      </Layout.BackendPanel>
    </div>
  );
}
