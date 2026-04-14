import { useOutletContext, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import { settingsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "components/backend/layout";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import PageHeader from "components/backend/layout/PageHeader";

export const action = formAction({
  mutation: ({ data }) => settingsAPI.update(null, data)
});

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
          notifyOnSuccess={{
            heading: t("notifications.settings_save_success_heading"),
            body: t("notifications.settings_save_success_body")
          }}
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
