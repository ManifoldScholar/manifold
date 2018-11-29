import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";

export class SettingsIntegrationsContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    settings: PropTypes.object
  };

  render() {
    if (!this.props.settings) return null;
    return (
      <div>
        <Layout.ViewHeader>External Integrations Settings</Layout.ViewHeader>
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.FieldGroup label="Facebook">
              <Form.TextInput
                focusOnMount
                label="Facebook App ID"
                name="attributes[integrations][facebookAppId]"
              />
              <Form.TextInput
                label="Facebook App Secret"
                name="attributes[secrets][facebookAppSecret]"
                password
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Twitter">
              <Form.TextInput
                label="Twitter Consumer Key"
                name="attributes[integrations][twitterAppId]"
              />
              <Form.TextInput
                password
                label="Twitter Consumer Secret"
                name="attributes[secrets][twitterAppSecret]"
              />
              <Form.TextInput
                label="Twitter Access Token"
                name="attributes[integrations][twitterAccessToken]"
              />
              <Form.TextInput
                password
                label="Twitter Access Token Secret"
                name="attributes[secrets][twitterAccessTokenSecret]"
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Google Services Integration">
              <Form.Upload
                layout="square"
                accepts="json"
                label="Google Service Config File"
                name="attributes[googleService]"
                wide
              />
              <Form.TextArea
                label="Google Private Key"
                wide
                name="attributes[secrets][googlePrivateKey]"
              />
              <Form.TextInput
                label="Google Project Id"
                name="attributes[integrations][googleProjectId]"
              />
              <Form.TextInput
                label="Google Private Key ID"
                name="attributes[integrations][googlePrivateKeyId]"
              />
              <Form.TextInput
                label="Google Client Email"
                name="attributes[integrations][googleClientEmail]"
              />
              <Form.TextInput
                label="Google Client ID"
                name="attributes[integrations][googleClientId]"
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Google OAuth">
              <Form.TextInput
                label="Google OAuth Client ID"
                name="attributes[integrations][googleOauthClientId]"
              />
              <Form.TextInput
                label="Google Client Secret"
                password
                name="attributes[secrets][googleOauthClientSecret]"
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Google Analytics">
              <Form.MaskedTextInput
                label="Google Analytics Profile ID"
                name="attributes[integrations][gaProfileId]"
                placeholder="ga:123456789"
                mask={[
                  "g",
                  "a",
                  ":",
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/
                ]}
              />
              <Form.TextInput
                label="Google Analytics Tracking ID"
                name="attributes[integrations][gaTrackingId]"
                placeholder="UA-000000-00"
              />
            </Form.FieldGroup>
            <Form.Save text="Save Settings" />
          </FormContainer.Form>
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connect(SettingsIntegrationsContainer.mapStateToProps)(
  SettingsIntegrationsContainer
);
