import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, MaskedTextInput } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { settingsAPI, requests } from 'api';
import { select } from 'utils/entityUtils';

class SettingsIntegrationsContainer extends PureComponent {

  static propTypes = {
  };

  static mapStateToProps(state) {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  }

  render() {
    if (!this.props.settings) return null;
    return (
      <section>
        <FormContainer.Form
          model={this.props.settings}
          name="backend-settings"
          update={settingsAPI.update}
          create={settingsAPI.update}
          className="form-secondary"
        >

          <div className="form-header">
            <header className="section-heading-secondary">
              <h3>Facebook Configuration</h3>
            </header>
          </div>
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

          <div className="form-header">
            <header className="section-heading-secondary">
              <h3>Twitter Configuration</h3>
            </header>
          </div>
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

          <div className="form-header">
            <header className="section-heading-secondary">
              <h3>Google Drive Import Configuration</h3>
            </header>
          </div>
          <Form.TextInput
            label="Google Project Id"
            name="attributes[integrations][googleProjectId]"
          />
          <Form.TextInput
            label="Google Private Key ID"
            name="attributes[integrations][googlePrivateKeyId]"
          />
          <Form.TextArea
            label="Google Private Key"
            name="attributes[secrets][googlePrivateKey]"
          />
          <Form.TextInput
            label="Google Client Email"
            name="attributes[integrations][googleClientEmail]"
          />
          <Form.TextInput
            label="Google Client ID"
            name="attributes[integrations][googleClientId]"
          />
          <div className="form-header">
            <header className="section-heading-secondary">
              <h3>Google OAuth Configuration</h3>
            </header>
          </div>
          <Form.TextInput
            label="Google Client ID"
            name="attributes[integrations][googleOauthClientId]"
          />
          <Form.TextInput
            label="Google Client Secret"
            password
            name="attributes[secrets][googleOauthClientSecret]"
          />

          <div className="form-header">
            <header className="section-heading-secondary">
              <h3>Google Analytics Configuration</h3>
            </header>
          </div>
          <Form.MaskedTextInput
            label="Google Analytics Profile ID"
            name="attributes[integrations][gaProfileId]"
            placeholder="ga:123456789"
            mask={
              ['g', 'a', ':', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
            }
          />
          <Form.TextInput
            label="Google Analytics Tracking ID"
            name="attributes[integrations][gaTrackingId]"
            placeholder="UA-000000-00"
          />
          <Form.Save
            text="Save Settings"
          />
        </FormContainer.Form>
      </section>
    );
  }

}

export default connect(
  SettingsIntegrationsContainer.mapStateToProps
)(SettingsIntegrationsContainer);

