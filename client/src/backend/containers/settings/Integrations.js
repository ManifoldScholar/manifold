import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";
import PageHeader from "backend/components/layout/PageHeader";

export class SettingsIntegrationsContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    settings: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    if (!this.props.settings) return null;
    const t = this.props.t;
    return (
      <div>
        <PageHeader title={t("settings.integrations.header")} type="settings" />
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.FieldGroup label={"Facebook"}>
              <Form.TextInput
                focusOnMount
                label={t("settings.integrations.facebook_id_label")}
                name="attributes[integrations][facebookAppId]"
              />
              <Form.TextInput
                label={t("settings.integrations.facebook_secret_label")}
                name="attributes[secrets][facebookAppSecret]"
                password
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Twitter">
              <Form.TextInput
                label={t("settings.integrations.twitter_key_label")}
                name="attributes[integrations][twitterAppId]"
              />
              <Form.TextInput
                password
                label={t("settings.integrations.twitter_secret_label")}
                name="attributes[secrets][twitterAppSecret]"
              />
              <Form.TextInput
                label={t("settings.integrations.twitter_token_label")}
                name="attributes[integrations][twitterAccessToken]"
              />
              <Form.TextInput
                password
                label={t("settings.integrations.twitter_token_secret_label")}
                name="attributes[secrets][twitterAccessTokenSecret]"
              />
            </Form.FieldGroup>
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
              label={t("settings.integrations.google_oauth_header")}
            >
              <Form.TextInput
                label={t("settings.integrations.google_oauth_id_label")}
                name="attributes[integrations][googleOauthClientId]"
              />
              <Form.TextInput
                label={t("settings.integrations.google_client_secret_label")}
                password
                name="attributes[secrets][googleOauthClientSecret]"
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
}

export default withTranslation()(
  connect(SettingsIntegrationsContainer.mapStateToProps)(
    SettingsIntegrationsContainer
  )
);
