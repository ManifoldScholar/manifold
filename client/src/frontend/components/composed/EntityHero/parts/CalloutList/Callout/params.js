import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export const getCalloutParams = (data, type, isLink, t) => {
  const slug = data.relationships?.text?.attributes?.slug ?? null;
  const tocSectionId =
    data.relationships?.text?.attributes.tocSectionId ?? null;

  switch (type) {
    case "READ":
      return {
        icon: isLink ? "arrowRight24" : "glasses64",
        iconSize: isLink ? 24 : 46,
        url: lh.link("reader", slug),
        title: data.attributes.title || t("actions.read"),
        as: Link,
        primary: true
      };
    case "DOWNLOAD":
      return {
        icon: "arrowDown24",
        iconSize: 24,
        url: data.attributes.attachmentStyles.original,
        title: data.attributes.title || t("actions.download"),
        as: "a"
      };
    case "LINK":
      return {
        icon: isLink ? "arrowRight24" : null,
        iconSize: isLink ? 24 : 46,
        url: data.attributes.url,
        title: data.attributes.title || t("placeholders.link"),
        as: "UserLink"
      };
    case "TOC":
      return {
        icon: isLink ? "arrowRight24" : "toc64",
        iconSize: isLink ? 24 : 46,
        url: tocSectionId
          ? lh.link("readerSection", slug, tocSectionId)
          : lh.link("reader", slug),
        title: data.attributes.title || t("actions.view_contents"),
        as: Link
      };
    // LD: Not translating placeholders for these cases because we aren't using them. Would only be added if we implement the new icons for journal callouts.
    case "WEBSITE":
      return {
        icon: "link24",
        iconSize: 24,
        url: data.attributes.url,
        title: data.attributes.title || "Website",
        as: "a"
      };
    case "SHARE":
      return {
        icon: "share24",
        iconSize: 24,
        url: data.attributes.url,
        title: data.attributes.title || "Share",
        as: "a"
      };
    case "EMAIL":
      return {
        icon: "mail24",
        iconSize: 24,
        url: data.attributes.url,
        title: data.attributes.title || "Email",
        as: "a"
      };
    default:
      return { mismatch: true };
  }
};
