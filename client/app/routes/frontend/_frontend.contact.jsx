import { redirect } from "react-router";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import { ApiClient, contactsAPI } from "api";
import { routerContext } from "app/contexts";
import GlobalForm from "global/containers/form";
import Form from "global/components/form";
import HeadContent from "global/components/HeadContent";

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });
  const formData = await request.formData();

  const dataString = formData.get("data");
  if (!dataString) {
    return {
      errors: [
        {
          detail: "Invalid form data",
          source: { pointer: "/data" }
        }
      ]
    };
  }

  const data = JSON.parse(dataString);
  const contact = data.attributes || {};

  try {
    const result = await client.call(
      contactsAPI.create({ attributes: contact })
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect("/");
  } catch (error) {
    if (
      error instanceof Response &&
      error.status >= 300 &&
      error.status < 400
    ) {
      throw error;
    }

    return {
      errors: [
        {
          detail: error.message || "Failed to send message",
          source: { pointer: "/data" }
        }
      ]
    };
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
