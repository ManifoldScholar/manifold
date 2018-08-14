import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Layout } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import HigherOrder from "containers/global/HigherOrder";
import { settingsAPI, testMailsAPI, requests } from "api";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";

const { request } = entityStoreActions;

export class SettingsEmailContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    form: PropTypes.object,
    settings: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  sendTestEmail = event => {
    event.preventDefault();
    const call = testMailsAPI.create();
    const testMailRequest = request(call, requests.beCreateTestMail);
    this.props
      .dispatch(testMailRequest)
      .promise.then(this.notifyEmailSuccess, this.notifyEmailFail);
  };

  notifyEmailSuccess = responseIgnored => {
    const notification = {
      level: 0,
      id: `TEST_EMAIL_SENT`,
      heading: "The test email appears to have been sent.",
      body: "Expect to receive it shortly.",
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  };

  render() {
    if (!this.props.settings) return null;
    return (
      <section>
        <Layout.ViewHeader>Email Settings</Layout.ViewHeader>
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.FieldGroup label="Message Settings">
              <Form.TextInput
                focusOnMount
                label="Email from address"
                name="attributes[email][fromAddress]"
                placeholder="do-not-reply@manifoldapp.org"
                instructions="All emails sent by manifold will be from this address."
              />
              <Form.TextInput
                label="Email from name"
                name="attributes[email][fromName]"
                placeholder="Manifold Scholarship"
                instructions="All emails sent by manifold will appear to be sent by this name."
              />
              <Form.TextInput
                label="Email reply-to address"
                name="attributes[email][replyToAddress]"
                placeholder="do-not-reply@manifoldapp.org"
                instructions="Replies to emails sent by Manifold will go to this address."
              />
              <Form.TextInput
                label="Email reply-to name"
                name="attributes[email][replyToName]"
                instructions="Replies to emails sent by Manifold will appear to be sent by this name."
              />
              <Form.TextArea
                label="Email closing"
                name="attributes[email][closing]"
                placeholder={"Sincerely,\nThe Manifold Team"}
                instructions="How do you want to close emails sent by Manifold?"
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Email Delivery Method">
              <Form.Select
                label="Email Delivery Method"
                name="attributes[email][deliveryMethod]"
                options={[
                  { label: "", value: "" },
                  { label: "SMTP", value: "smtp" },
                  { label: "Sendmail", value: "sendmail" }
                ]}
              />
            </Form.FieldGroup>
            {this.props.form.getModelValue(
              "attributes[email][deliveryMethod]"
            ) === "smtp" ? (
              <Form.FieldGroup label={"SMTP Configuration"}>
                <Form.TextInput
                  label="SMTP Address"
                  name="attributes[email][smtpSettingsAddress]"
                  instructions="Allows you to use a remote mail server."
                />
                <Form.TextInput
                  label="SMTP Port"
                  name="attributes[email][smtpSettingsPort]"
                  instructions="On the off chance that your mail server doesn't run on port 25, you can change it."
                />
                <Form.TextInput
                  label="SMTP Username"
                  name="attributes[email][smtpSettingsUserName]"
                  instructions="If your mail server requires authentication, set the username in this setting."
                />
                <Form.TextInput
                  password
                  label="SMTP Password"
                  name="attributes[secrets][smtpSettingsPassword]"
                  instructions="If your mail server requires authentication, set the password in this setting."
                />
              </Form.FieldGroup>
            ) : null}
            {this.props.form.getModelValue(
              "attributes[email][deliveryMethod]"
            ) === "sendmail" ? (
              <Form.FieldGroup label="Sendmail Configuration">
                <Form.TextInput
                  label="Sendmail Location"
                  name="attributes[email][sendmailSettingsLocation]"
                  instructions="The location of the sendmail executable. Defaults to /usr/sbin/sendmail."
                />
                <Form.TextInput
                  label="Sendmail Arguments"
                  name="attributes[email][sendmailSettingsArguments]"
                  instructions="The command line arguments. Defaults to -i with -f sender@address added automatically before the message is sent."
                />
              </Form.FieldGroup>
            ) : null}
            <Form.Save text="Save Settings" />
            <p className="instructional-copy margin-top">
              <button
                className="button-secondary-dark"
                onClick={this.sendTestEmail}
              >
                Send test email
              </button>
            </p>
          </FormContainer.Form>
        </Layout.BackendPanel>
      </section>
    );
  }
}

export default HigherOrder.withFormSession(
  connect(SettingsEmailContainer.mapStateToProps)(SettingsEmailContainer),
  "backend-settings"
);
