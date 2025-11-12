import { unstable_useBlocker } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import Dialog from "global/components/dialog";

export default function NavigationBlocker({ when, message }) {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const blocker = unstable_useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowConfirm(true);
      setPendingNavigation(blocker);
    }
  }, [blocker]);

  const handleConfirm = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.proceed();
      setPendingNavigation(null);
    }
    setShowConfirm(false);
  }, [pendingNavigation]);

  const handleCancel = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.reset();
      setPendingNavigation(null);
    }
    setShowConfirm(false);
  }, [pendingNavigation]);

  if (!showConfirm) return null;

  return (
    <Dialog.Confirm
      message={message || t("messages.unsaved_changes")}
      heading={t("messages.confirm")}
      resolve={handleConfirm}
      reject={handleCancel}
    />
  );
}
