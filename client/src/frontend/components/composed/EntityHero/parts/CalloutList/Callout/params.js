import lh from "helpers/linkHandler";

export const getCalloutParams = (data, type, isLink) => {
  const slug = data.relationships?.texts?.attributes?.slug ?? null;
  const tocSectionId =
    data.relationships?.texts?.attributes.tocSectionId ?? null;

  switch (type) {
    case "READ":
      return {
        icon: isLink ? "arrowRight16" : "glasses64",
        iconSize: isLink ? 17.333 : 46,
        url: lh.link("reader", slug),
        title: data.attributes.title || "Start Reading",
        as: null,
        primary: true
      };
    case "DOWNLOAD":
      return {
        icon: "arrowDown16",
        iconSize: isLink ? 17.333 : 22.662,
        url: data.attributes.attachmentStyles.original,
        title: data.attributes.title || "Download",
        as: "a"
      };
    case "LINK":
      return {
        icon: isLink ? "arrowRight16" : null,
        iconSize: isLink ? 17.333 : 46,
        url: data.attributes.url,
        title: data.attributes.title || "Link",
        as: "UserLink"
      };
    case "TOC":
      return {
        icon: isLink ? "arrowRight16" : "toc64",
        iconSize: isLink ? 17.333 : 46,
        url: tocSectionId
          ? lh.link("readerSection", slug, tocSectionId)
          : lh.link("reader", slug),
        title: data.attributes.title || "View Contents",
        as: "a"
      };
    case "WEBSITE":
      return {
        icon: "link24",
        iconSize: isLink ? 17.333 : 22.662,
        url: data.attributes.url,
        title: data.attributes.title || "Website",
        as: "a"
      };
    case "SHARE":
      return {
        icon: "share24",
        iconSize: isLink ? 17.333 : 22.662,
        url: data.attributes.url,
        title: data.attributes.title || "Share",
        as: "a"
      };
    case "EMAIL":
      return {
        icon: "mail24",
        iconSize: isLink ? 17.333 : 22.662,
        url: data.attributes.url,
        title: data.attributes.title || "Email",
        as: "a"
      };
    default:
      return { mismatch: true };
  }
};
