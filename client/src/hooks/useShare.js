import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { urlWithTextFragment } from "./useCopyLinkToSelection";
import useFromStore from "./useFromStore";

export default function useShare({
  title,
  urlTextFragment,
  shareOnly = false,
  appendDefaultTitle = true,
  size = "lg"
}) {
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

  const settings = useFromStore({ requestKey: "settings", action: "select" });

  const shareIcon = size === "sm" ? "share24" : "share32";

  if (!isMounted)
    return {
      canRender: true,
      disabled: true,
      icon: shareIcon,
      label: t("actions.share")
    };

  const headTitle = settings?.attributes.general.headTitle;

  const appendedTitle =
    headTitle && appendDefaultTitle ? `${title} | ${headTitle}` : title;

  const baseUrl = window.location.toString();
  const { status, fragment } = urlTextFragment ?? {};
  const url = status === 0 ? urlWithTextFragment(baseUrl, fragment) : baseUrl;

  const shareData = { title: appendedTitle, url };

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
      icon: shareIcon,
      label: t("actions.share")
    };

  const clipboardSupported = navigator?.clipboard;

  const canRender = !!(shareSupported || clipboardSupported);

  /* eslint-disable no-nested-ternary */
  const icon = shareSupported
    ? shareIcon
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
