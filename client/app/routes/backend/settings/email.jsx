import { useCallback } from "react";
import { useOutletContext, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import { settingsAPI, testMailsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import { useApiCallback, useNotifications } from "hooks";
import Layout from "components/backend/layout";
import Form from "components/global/form";
import FormContainer from "global/containers/form";
import PageHeader from "components/backend/layout/PageHeader";

export const action = formAction({
  mutation: ({ data }) => settingsAPI.update(null, data)
});

export default function SettingsEmailRoute() {
  const { t } = useTranslation();
  const settings = useOutletContext();
  const fetcher = useFetcher();

  const sendTestEmail = useApiCallback(testMailsAPI.create);

  const { addNotification } = useNotifications();

  const handleSendTestEmail = useCallback(
    async event => {
      event.preventDefault();
      try {
        await sendTestEmail();
        addNotification({
          level: 0,
          id: `TEST_EMAIL_SENT`,
          heading: t("notifications.email.success"),
          body: t("notifications.email_success_body"),
          expiration: 5000
        });
      } catch {
        addNotification({
          level: 0,
          id: `TEST_EMAIL_NOT_SENT`,
          heading: t("notifications.email_failure"),
          body: t("notifications.email_failure_body"),
          expiration: 5000
        });
      }
    },
    [sendTestEmail, addNotification, t]
  );

  return (
    <section>
      <PageHeader title={t("settings.email.header")} type="settings" />
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
          {getModelValue => {
            const deliveryMethod = getModelValue(
              "attributes[email][deliveryMethod]"
            );

            return (
              <>
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
                {deliveryMethod === "smtp" ? (
                  <Form.FieldGroup
                    label={t("settings.email.config_header", {
                      method: "SMTP"
                    })}
                  >
                    <Form.TextInput
                      label={t("settings.email.smtp_address_label")}
                      name="attributes[email][smtpSettingsAddress]"
                      instructions={t(
                        "settings.email.smtp_address_instructions"
                      )}
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
                      instructions={t(
                        "settings.email.smtp_password_instructions"
                      )}
                    />
                  </Form.FieldGroup>
                ) : null}
                {deliveryMethod === "sendmail" ? (
                  <Form.FieldGroup
                    label={t("settings.email.config_header", {
                      method: "Sendmail"
                    })}
                  >
                    <Form.TextInput
                      label={t("settings.email.sendmail_loc_label")}
                      name="attributes[email][sendmailSettingsLocation]"
                      instructions={t(
                        "settings.email.sendmail_loc_instructions"
                      )}
                    />
                    <Form.TextInput
                      label={t("settings.email.sendmail_args_label")}
                      name="attributes[email][sendmailSettingsArguments]"
                      instructions={t(
                        "settings.email.sendmail_args_instructions"
                      )}
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
                    onClick={handleSendTestEmail}
                  >
                    {t("settings.email.send_test")}
                  </button>
                </div>
              </>
            );
          }}
        </FormContainer.Form>
      </Layout.BackendPanel>
    </section>
  );
}
