import { redirect } from "react-router";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import { passwordsAPI } from "api";
import { getApiClient } from "app/routes/utility/helpers/getApiClient";
import GlobalForm from "global/containers/form";
import Form from "global/components/form";
import HeadContent from "global/components/HeadContent";

export async function action({ request, context, params }) {
  const client = getApiClient(context);
  const data = await request.json();
  const { password, passwordConfirmation } = data.attributes || {};
  const resetToken = params.resetToken;

  try {
    const result = await client.call(
      passwordsAPI.update(password, passwordConfirmation, resetToken)
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    // After successful password reset, user should be logged in
    // Redirect to home - login will happen automatically via token
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
      errors: error?.body?.errors || [
        {
          detail: error.message || "Failed to reset password",
          source: { pointer: "/data" }
        }
      ]
    };
  }
}

export default function PasswordResetRoute({ actionData }) {
  const { t } = useTranslation();
  const submit = useSubmit();
  const errors = actionData?.errors || [];

  return (
    <>
      <HeadContent title={t("forms.password_reset.title")} appendDefaultTitle />
      <section>
        <div className="container">
          <GlobalForm.Form
            submit={submit}
            errors={errors}
            model={{ attributes: {} }}
            className="form-primary"
          >
            <Form.Header
              styleType="primary"
              label={t("forms.password_reset.title")}
            />
            <Form.FieldGroup>
              <Form.Input
                type="password"
                name="attributes[password]"
                id="reset-password"
                placeholder={t("forms.password_reset.new_placeholder")}
                aria-describedby="reset-password-error"
                idForError="reset-password-error"
                label={t("forms.password_reset.new")}
                wide
              />
              <Form.Input
                type="password"
                id="reset-password-confirmation"
                placeholder={t("forms.password_reset.confirm_placeholder")}
                aria-describedby="reset-password-confirmation-error"
                name="attributes[passwordConfirmation]"
                idForError="reset-password-confirmation-error"
                label={t("forms.password_reset.confirm")}
                wide
              />
              <Form.Errorable name="attributes[resetToken]" errors={errors}>
                <input
                  className="button-secondary"
                  type="submit"
                  value={t("forms.password_reset.submit_reset")}
                />
              </Form.Errorable>
            </Form.FieldGroup>
          </GlobalForm.Form>
        </div>
      </section>
    </>
  );
}
