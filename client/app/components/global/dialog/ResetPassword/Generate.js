import React from "react";
import { useTranslation } from "react-i18next";
import Body from "../Confirm/ConfirmModalBody";
import { passwordsAPI } from "api";
import { useApiCallback } from "hooks";

export default function GenerateNewPassword({ user, resolve, setConfirm }) {
  const { t } = useTranslation();

  const reset = useApiCallback(passwordsAPI.admin_reset_password);

  const handleReset = e => {
    e.preventDefault();
    reset(user.id).then(() => {
      resolve();
    });
  };

  return (
    <Body
      heading={t("modals.reset_password")}
      message={t("modals.confirm_body")}
      resolve={handleReset}
      reject={() => setConfirm(false)}
      id="reset-confirm"
    />
  );
}
