import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { contactsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import GlobalForm from "components/global/form/Container";
import Form from "components/global/form";
import HeadContent from "components/global/HeadContent";

export const action = formAction({
  mutation: ({ data }) =>
    contactsAPI.create({ attributes: data.attributes || {} }),
  errorMessage: "Failed to send message"
});

export default function ContactRoute() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors || [];

  return (
    <>
      <HeadContent title={t("titles.contact")} appendDefaultTitle />
      <section>
        <div className="container">
          <GlobalForm.Form
            fetcher={fetcher}
            errors={errors}
            model={{ attributes: {} }}
            className="form-primary"
            notifyOnSuccess={{
              heading: t("notifications.contact_sent_heading")
            }}
          >
            <Form.Header styleType="primary" label={t("forms.contact.title")} />
            <Form.FieldGroup>
              <Form.Input
                type="text"
                name="attributes[email]"
                id="create-email"
                idForError="create-email-error"
                placeholder={t("forms.contact.email_placeholder")}
                label={t("forms.contact.email")}
                wide
              />
              <Form.Input
                type="text"
                id="create-name"
                aria-describedby="create-name-error"
                placeholder={t("forms.contact.name_placeholder")}
                name="attributes[fullName]"
                idForError="create-name-error"
                wide
                label={t("forms.contact.name")}
              />
              <Form.TextArea
                label={t("forms.contact.message")}
                name="attributes[message]"
                idForError="create-message-error"
                id="create-message"
                placeholder={t("forms.contact.message_placeholder")}
                aria-describedby="create-message-error"
              />
              <input
                className="button-secondary button-secondary--with-room"
                type="submit"
                value={t("forms.contact.button_label")}
              />
            </Form.FieldGroup>
          </GlobalForm.Form>
        </div>
      </section>
    </>
  );
}
