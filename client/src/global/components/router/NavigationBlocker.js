import { useBlocker } from "react-router";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import Dialog from "global/components/dialog";

export default function NavigationBlocker({ when, message }) {
  const { t } = useTranslation();

  const shouldBlock = useCallback(() => {
    return when;
  }, [when]);

  const blocker = useBlocker(shouldBlock);

  // Temp fix until Form is refactored. Blocker has stale state after submit.
  // This allows redirects after submit.
  useEffect(() => {
    if (when === false && blocker.state === "blocked") return blocker.proceed();
  }, [blocker, when]);

  useEffect(() => {
    return () => {
      if (blocker.state === "blocked") blocker.reset();
    };
  }, [blocker]);

  const handleConfirm = () => {
    if (blocker?.proceed) blocker.proceed();
  };

  const handleCancel = () => {
    if (blocker?.reset) blocker.reset();
  };

  return blocker.state === "blocked" ? (
    <Dialog.Confirm
      message={message || t("messages.unsaved_changes")}
      heading={t("messages.confirm")}
      resolve={handleConfirm}
      reject={handleCancel}
    />
  ) : null;
}
