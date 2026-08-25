import { useState, useId } from "react";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, requests } from "api";
import { useFromStore } from "hooks";
import PageHeader from "backend/components/layout/PageHeader";
import LtiAllowBlockListInput from "backend/components/settings/LtiAllowBlockList/index";

export default function SettingsIntegrationsContainer() {
  const { t } = useTranslation();
  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });

  const [issuerAllowState, setAllowState] = useState(
    settings?.attributes.lti.issuerAllowlist ?? []
  );
  const [issuerBlockState, setBlockState] = useState(
    settings?.attributes.lti.issuerBlocklist ?? []
  );

  const id = useId();

  if (!settings) return null;

  const formatData = data => {
    const lti = data.attributes.lti;
    return {
      attributes: {
        ...data.attributes,
        lti: {
          ...lti,
          issuerAllowlist: issuerAllowState,
          issuerBlocklist: issuerBlockState
        }
      }
    };
  };

  return (
    <div>
      <PageHeader title={t("settings.integrations.header")} type="settings" />
      <Layout.BackendPanel>
        <FormContainer.Form
          model={settings}
          name="backend-settings"
          update={settingsAPI.update}
          create={settingsAPI.update}
          formatData={formatData}
          className="form-secondary"
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
          <Form.FieldGroup label={t("settings.oai.header")}>
            <Form.TextInput
              label={t("settings.oai.repository_name_label")}
              name="attributes[oai][repositoryName]"
              placeholder="Manifold"
            />
            <Form.TextInput
              label={t("settings.oai.admin_email_label")}
              name="attributes[oai][adminEmail]"
              placeholder="admin@manifold.app"
            />
            <Form.Switch
              wide
              label={t("settings.oai.directory_enabled_label")}
              name="attributes[oai][directoryEnabled]"
              instructions={t("settings.oai.directory_enabled_instructions")}
            />
          </Form.FieldGroup>
          <Form.FieldGroup label={t("settings.lti.header")}>
            <Form.Switch
              label={t("settings.lti.enabled")}
              name="attributes[lti][enabled]"
              instructions={t("settings.lti.enabled_instructions")}
            />
            <Form.Switch
              label={t("settings.lti.autoregistration")}
              name="attributes[lti][autoregistration]"
              instructions={t("settings.lti.autoregistration_instructions")}
            />
            <div>
              <Form.Label
                as="h3"
                label={t(`settings.lti.domains_label`)}
                styleType="secondary"
              />
              <Form.Instructions
                wide
                id={id}
                instructions={t("settings.lti.domains_instructions")}
              />
            </div>
            <LtiAllowBlockListInput
              type="allow"
              value={issuerAllowState}
              setValue={setAllowState}
              instructionsId={id}
            />
            <LtiAllowBlockListInput
              type="block"
              value={issuerBlockState}
              setValue={setBlockState}
              instructionsId={id}
            />
          </Form.FieldGroup>
          <Form.Save text={t("settings.save")} />
        </FormContainer.Form>
      </Layout.BackendPanel>
    </div>
  );
}
