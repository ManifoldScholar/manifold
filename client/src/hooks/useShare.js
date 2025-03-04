import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useShare(title, shareOnly = false) {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (copied) {
      window.setTimeout(() => setCopied(false), 1500);
    }
  }, [copied]);

  if (!isMounted)
    return {
      canRender: true,
      disabled: true,
      icon: "share24",
      label: t("actions.share")
    };

  const url = window.location.toString();
  const shareData = { title, url };

  /* eslint-disable */
  const onShare = async () => {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error(err);
      return { err };
    }
  };

  const onCopy = () => {
    navigator?.clipboard.writeText(url).then(() => setCopied(true));
  };
  /* eslint-enable */

  const shareSupported =
    typeof navigator?.canShare === "function" && navigator.canShare(shareData);

  if (shareOnly)
    return {
      canRender: shareSupported,
      onClick: onShare,
      icon: "share24",
      label: t("actions.share")
    };

  const clipboardSupported = navigator?.clipboard;

  const canRender = !!(shareSupported || clipboardSupported);

  /* eslint-disable no-nested-ternary */
  const icon = shareSupported
    ? "share24"
    : copied
    ? "checkmark16"
    : "RTELink24";
  const label = shareSupported
    ? t("actions.share")
    : copied
    ? t("actions.copied")
    : t("actions.copy");
  const srLabel = shareSupported
    ? t("actions.share")
    : copied
    ? t("actions.copy_link_to", { title })
    : t("actions.share_title", { title });

  return {
    canRender,
    onClick: shareSupported ? onShare : onCopy,
    icon,
    label,
    srLabel
  };
}
