import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useApiCallback, useAccountLink } from "hooks";
import { passwordsAPI, tokensAPI } from "api";
import lh from "helpers/linkHandler";
import { resolveAuthRedirect } from "helpers/router/authRedirect";
import { handleAuthenticationSuccess } from "store/middleware/currentUserMiddleware";
import Form, { Unwrapped } from "global/components/form";
import { currentUserActions } from "actions";

export default function PasswordResetContainer() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const { token: accountLinkToken, isLinking } = useAccountLink();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);

  const updatePassword = useApiCallback(passwordsAPI.update);

  const loginUser = user => {
    dispatch(
      currentUserActions.login({
        email: user.attributes.email,
        password
      })
    );
  };

  // The reset token is spent by now, so a failed link can't be retried here.
  // Send the user to the login view with their new password to try again.
  const redirectToLinkRetry = async (email, response) => {
    let message = t("forms.signin_overlay.account_link_error");
    try {
      const body = await response.json();
      const first = body?.errors?.[0];
      if (typeof first === "string") message = first;
      else if (typeof first?.detail === "string") message = first.detail;
    } catch (e) {
      // Keep the generic message.
    }
    const params = new URLSearchParams({
      account_link: email,
      account_link_token: accountLinkToken,
      account_link_error: message
    });
    navigate(`${lh.link("frontendLogin")}?${params.toString()}`);
  };

  const linkAccount = async user => {
    const email = user.attributes.email;
    try {
      const res = await tokensAPI.createToken({
        email,
        password,
        accountLinkToken
      });
      await handleAuthenticationSuccess(dispatch, {
        authToken: res.meta.authToken,
        user: res,
        setCookie: true
      });
      navigate(resolveAuthRedirect(res.meta.redirect), { replace: true });
    } catch (response) {
      await redirectToLinkRetry(email, response);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrors([]);
    try {
      const res = await updatePassword(
        password,
        passwordConfirmation,
        resetToken,
        accountLinkToken
      );
      if (isLinking) {
        await linkAccount(res.data);
        return;
      }
      loginUser(res.data);
      navigate("/");
    } catch (error) {
      if (error?.body?.errors) {
        setErrors(error.body.errors);
      }
    }
  };

  const handleInputChange = event => {
    const name = event.target.name.replace("attributes[", "").replace("]", "");
    if (name === "password") {
      setPassword(event.target.value);
    } else if (name === "passwordConfirmation") {
      setPasswordConfirmation(event.target.value);
    }
  };

  return (
    <section>
      <div className="container">
        <form method="post" onSubmit={handleSubmit}>
          <Form.Header
            styleType="primary"
            label={t("forms.password_reset.title")}
          />
          <Form.FieldGroup>
            <Unwrapped.Input
              value={password}
              type="password"
              name="attributes[password]"
              id="reset-password"
              onChange={handleInputChange}
              placeholder={t("forms.password_reset.new_placeholder")}
              aria-describedby="reset-password-error"
              errors={errors}
              idForError="reset-password-error"
              label={t("forms.password_reset.new")}
              wide
            />
            <Unwrapped.Input
              value={passwordConfirmation}
              type="password"
              id="reset-password-confirmation"
              onChange={handleInputChange}
              placeholder={t("forms.password_reset.confirm_placeholder")}
              aria-describedby="reset-password-confirmation-error"
              name="attributes[passwordConfirmation]"
              errors={errors}
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
        </form>
      </div>
    </section>
  );
}
