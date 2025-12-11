import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import { passwordsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import GlobalForm from "components/global/form/Container";
import Form from "components/global/form";
import HeadContent from "components/global/HeadContent";

export const action = formAction({
  mutation: ({ data, params }) =>
    passwordsAPI.update(
      data.attributes?.password,
      data.attributes?.passwordConfirmation,
      params.resetToken
    ),
  redirectTo: () => "/",
  errorMessage: "Failed to reset password"
});

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
