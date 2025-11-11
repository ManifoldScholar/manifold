import { useId, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigationBlocker } from "./NavigationBlockerContext";

export default function NavigationBlocker({ when, message }) {
  const { t } = useTranslation();
  const { registerBlocker, unregisterBlocker } = useNavigationBlocker();
  const id = useId();

  const blockerMessage = useMemo(
    () => message || t("messages.unsaved_changes"),
    [message, t]
  );

  useEffect(() => {
    if (when) {
      registerBlocker(id, blockerMessage);
    } else {
      unregisterBlocker(id);
    }

    return () => {
      unregisterBlocker(id);
    };
  }, [when, id, blockerMessage, registerBlocker, unregisterBlocker]);

  return null;
}
