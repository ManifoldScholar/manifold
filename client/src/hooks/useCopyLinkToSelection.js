import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";

export const urlWithTextFragment = (url, fragment) => {
  const prefix = fragment.prefix
    ? `${encodeURIComponent(fragment.prefix)}-,`
    : "";
  const suffix = fragment.suffix
    ? `,-${encodeURIComponent(fragment.suffix)}`
    : "";
  const start = encodeURIComponent(fragment.textStart);
  const end = fragment.textEnd
    ? `,${encodeURIComponent(fragment.textEnd)}`
    : "";

  return `${url}#:~:text=${prefix}${start}${end}${suffix}`;
};

export default function useCopyLinkToSelection(
  text,
  section,
  urlTextFragment,
  afterCopy
) {
  const { t } = useTranslation();

  const getBaseUrl = useCallback(() => {
    if (typeof window === "undefined") return null;
    const readerUrl = lh.link(
      "readerSection",
      text.attributes.slug,
      section.id
    );
    return `${window.location.origin}${readerUrl}`;
  }, [text, section]);

  const generateUrl = useCallback(() => {
    const url = getBaseUrl();
    if (!url) return null;

    const { status, fragment } = urlTextFragment ?? {};

    if (status === 0) {
      return urlWithTextFragment(url, fragment);
    }

    return url;
  }, [urlTextFragment, getBaseUrl]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      window.setTimeout(() => setCopied(false), 1500);
    }
  }, [copied]);

  /* eslint-disable */
  const onClick = () => {
    const href = generateUrl();
    navigator?.clipboard.writeText(href).then(() => {
      setCopied(true);
      if (afterCopy) afterCopy();
    });
  };
  /* eslint-enable */

  const icon = copied ? "checkmark16" : "RTELink24";
  const label = copied ? t("actions.copied") : t("reader.menus.popup.copy");
  const srLabel = copied
    ? t("actions.copied")
    : t("reader.menus.popup.copy_selection");

  return { onClick, icon, label, srLabel };
}
