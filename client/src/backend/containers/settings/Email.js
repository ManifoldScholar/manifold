import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, testMailsAPI, requests } from "api";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import PageHeader from "backend/components/layout/PageHeader";

import withFormSession from "hoc/withFormSession";

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
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func
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
    const t = this.props.t;
    const notification = {
      level: 0,
      id: `TEST_EMAIL_SENT`,
      heading: t("notifications.email.success"),
      body: t("notifications.email_success_body"),
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  };

  notifyEmailFail = responseIgnored => {
    const t = this.props.t;
    const notification = {
      level: 0,
      id: `TEST_EMAIL_NOT_SENT`,
      heading: t("notifications.email_failure"),
      body: t("notifications.email_failure_body"),
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  };

  render() {
    if (!this.props.settings) return null;
    const t = this.props.t;

    return (
      <section>
        <PageHeader title={t("settings.email.header")} type="settings" />
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.FieldGroup label={t("settings.email.message_header")}>
              <Form.TextInput
                focusOnMount
                label={t("settings.email.from_label")}
                name="attributes[email][fromAddress]"
                placeholder={t("settings.email.from_placeholder")}
                instructions={t("settings.email.from_instructions")}
              />
              <Form.TextInput
                label={t("settings.email.name_label")}
                name="attributes[email][fromName]"
                placeholder={t("settings.email.name_placeholder")}
                instructions={t("settings.email.name_instructions")}
              />
              <Form.TextInput
                label={t("settings.email.reply_label")}
                name="attributes[email][replyToAddress]"
                placeholder={t("settings.email.from_placeholder")}
                instructions={t("settings.email.reply_instructions")}
              />
              <Form.TextInput
                label={t("settings.email.reply_name_label")}
                name="attributes[email][replyToName]"
                instructions={t("settings.email.reply_name_instructions")}
              />
              <Form.TextArea
                label={t("settings.email.closing_label")}
                name="attributes[email][closing]"
                placeholder={t("settings.email.closing_placeholder")}
                instructions={t("settings.email.closing_instructions")}
              />
            </Form.FieldGroup>
            <Form.FieldGroup label={t("settings.email.delivery_header")}>
              <Form.Select
                label={t("settings.email.delivery_header")}
                name="attributes[email][deliveryMethod]"
                // Leaving these options as I don't think they are localized. -LD
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
              <Form.FieldGroup
                label={t("settings.email.config_header", {
                  method: "SMTP"
                })}
              >
                <Form.TextInput
                  label={t("settings.email.smtp_address_label")}
                  name="attributes[email][smtpSettingsAddress]"
                  instructions={t("settings.email.smtp_address_instructions")}
                />
                <Form.TextInput
                  label={t("settings.email.smtp_port_label")}
                  name="attributes[email][smtpSettingsPort]"
                  instructions={t("settings.email.smtp_port_instructions")}
                />
                <Form.TextInput
                  label={t("settings.email.smtp_user_label")}
                  name="attributes[email][smtpSettingsUserName]"
                  instructions={t("settings.email.smtp_user_instructions")}
                />
                <Form.TextInput
                  password
                  label={t("settings.email.smtp_password_label")}
                  name="attributes[secrets][smtpSettingsPassword]"
                  instructions={t("settings.email.smtp_password_instructions")}
                />
              </Form.FieldGroup>
            ) : null}
            {this.props.form.getModelValue(
              "attributes[email][deliveryMethod]"
            ) === "sendmail" ? (
              <Form.FieldGroup
                label={t("settings.email.config_header", {
                  method: "Sendmail"
                })}
              >
                <Form.TextInput
                  label={t("settings.email.sendmail_loc_label")}
                  name="attributes[email][sendmailSettingsLocation]"
                  instructions={t("settings.email.sendmail_loc_instructions")}
                />
                <Form.TextInput
                  label={t("settings.email.sendmail_args_label")}
                  name="attributes[email][sendmailSettingsArguments]"
                  instructions={t("settings.email.sendmail_args_instructions")}
                />
              </Form.FieldGroup>
            ) : null}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                rowGap: "20px"
              }}
            >
              <Form.Save text={t("settings.save")} />
              <button
                className="button-secondary button-secondary--dull button-secondary--outlined"
                onClick={this.sendTestEmail}
              >
                {t("settings.email.send_test")}
              </button>
            </div>
          </FormContainer.Form>
        </Layout.BackendPanel>
      </section>
    );
  }
}

export default withFormSession(
  withTranslation()(
    connect(SettingsEmailContainer.mapStateToProps)(SettingsEmailContainer)
  ),
  "backend-settings"
);
