import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import { useNavigationBlocker } from "./NavigationBlockerContext";

export default function NavigationBlocker({ when, message }) {
  const { t } = useTranslation();
  const { registerBlocker, unregisterBlocker } = useNavigationBlocker();
  const id = useId();

  const blockerMessage = useMemo(
    () => message || t("messages.unsaved_changes"),
    [message, t]
  );

  /* Must be a layout effect, so the blocker is cleared before a navigation on form submit */
  useIsomorphicLayoutEffect(() => {
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
