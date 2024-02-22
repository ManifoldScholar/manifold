import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useApiCallback, useNotification } from "hooks";
import { emailConfirmationsAPI } from "api";
import { useTranslation } from "react-i18next";

export default function ResendEmailConfirmation({ id, hideOverlay }) {
  const { t } = useTranslation();
  const triggerConfirm = useApiCallback(emailConfirmationsAPI?.update);

  const notifyEmailSent = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_VERIFICATION_EMAIL_SENT`,
    heading: t("forms.signin_overlay.email_success_notification"),
    expiration: 3000
  }));

  const onClick = useCallback(
    async e => {
      e.preventDefault();

      try {
        await triggerConfirm(id);
        notifyEmailSent();
        if (hideOverlay) hideOverlay();
      } catch (err) {
        if (hideOverlay) hideOverlay();
      }
    },
    [id, triggerConfirm, notifyEmailSent, hideOverlay]
  );

  return (
    <button
      className="button-secondary button-secondary--outlined button-secondary--color-white"
      onClick={onClick}
    >
      {t("forms.signin_overlay.resend_verification")}
    </button>
  );
}

ResendEmailConfirmation.displayName =
  "Global.SignInUp.EditProfileForm.ResendEmailConfirm";

ResendEmailConfirmation.propTypes = {
  id: PropTypes.string,
  hideOverlay: PropTypes.func
};
