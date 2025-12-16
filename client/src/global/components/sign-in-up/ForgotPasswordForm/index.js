import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import Form from "global/components/form";
import { useNotification } from "hooks";
import * as SharedStyles from "../styles";

export default function ForgotPasswordForm({ handleViewChange, hideOverlay }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const notifySuccess = useNotification(email => ({
    level: 0,
    id: "PASSWORD_RESET_SENT",
    heading: t("forms.signin_overlay.send_reset_success", {
      email
    }),
    expiration: 3000
  }));

  const formatData = useCallback(data => {
    return data.email;
  }, []);

  useEffect(() => {
    if (fetcher.data?.success) {
      notifySuccess(fetcher.data.email || "your email");
      if (hideOverlay) hideOverlay();
    }
  }, [fetcher.data, hideOverlay, notifySuccess]);

  return (
    <div>
      <SharedStyles.Form
        fetcher={fetcher}
        action="/actions/forgot-password"
        formatData={formatData}
      >
        <Form.Header
          styleType="primary"
          label={t("forms.signin_overlay.reset_password")}
        />
        <Form.TextInput
          focusOnMount
          name="email"
          inputType="email"
          id="password-forgot-email"
          placeholder={t("forms.signin_overlay.email")}
          aria-describedby="password-forgot-email-error"
          label={t("forms.signin_overlay.email")}
          autoComplete="email"
        />
        <Form.InputError
          errors={
            fetcher.data?.errors && fetcher.state !== "loading"
              ? fetcher.data.errors
              : []
          }
        />
        <input
          className="button-secondary button-secondary--with-room"
          type="submit"
          value={t("forms.signin_overlay.send_password_reset")}
        />
      </SharedStyles.Form>
      <SharedStyles.LinksWrapper>
        <SharedStyles.ViewLink onClick={e => handleViewChange("login", e)}>
          {t("forms.signin_overlay.remember_password")}
        </SharedStyles.ViewLink>
        <SharedStyles.ViewLink onClick={e => handleViewChange("terms", e)}>
          {t("forms.signin_overlay.need_account")}
        </SharedStyles.ViewLink>
      </SharedStyles.LinksWrapper>
    </div>
  );
}

ForgotPasswordForm.displayName = "Global.SignInUp.ForgotPasswordForm";

ForgotPasswordForm.propTypes = {
  handleViewChange: PropTypes.func,
  hideOverlay: PropTypes.func
};
