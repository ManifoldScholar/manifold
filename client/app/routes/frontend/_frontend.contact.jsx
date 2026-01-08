import { redirect } from "react-router";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import { contactsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import GlobalForm from "global/containers/form";
import Form from "global/components/form";
import HeadContent from "global/components/HeadContent";

export async function action({ request, context }) {
  const data = await request.json();
  const contact = data.attributes || {};

  try {
    const result = await queryApi(
      contactsAPI.create({ attributes: contact }),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect("/");
  } catch (error) {
    return handleActionError(error, "Failed to send message");
  }
}

export default function ContactRoute({ actionData }) {
  const { t } = useTranslation();
  const submit = useSubmit();
  const errors = actionData?.errors || [];

  return (
    <>
      <HeadContent title={t("titles.contact")} appendDefaultTitle />
      <section>
        <div className="container">
          <GlobalForm.Form
            submit={submit}
            errors={errors}
            model={{ attributes: {} }}
            className="form-primary"
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
