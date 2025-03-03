import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useShare(title) {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (copied && isMounted) {
      window.setTimeout(() => setCopied(false), 1500);
    }
  }, [copied, isMounted]);

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
  const onShare = () => {
    navigator?.share(shareData).catch(error => {
      console.error(error);
    });
  };

  const onCopy = () => {
    navigator?.clipboard.writeText(url).then(() => setCopied(true));
  };
  /* eslint-enable */

  const shareSupported =
    typeof navigator?.canShare === "function" && navigator.canShare(shareData);
  const clipboardSupported = navigator?.clipboard;

  const canRenderShare = !!(shareSupported || clipboardSupported);

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

  return {
    canRender: canRenderShare,
    onClick: shareSupported ? onShare : onCopy,
    icon,
    label
  };
}
