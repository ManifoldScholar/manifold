import lh from "helpers/linkHandler";

export const getButtonParams = (data, type) => {
  const slug = data.relationships?.texts?.attributes?.slug ?? null;
  const tocSectionId =
    data.relationships?.texts?.attributes.tocSectionId ?? null;

  switch (type) {
    case "READ":
      return {
        icon: "arrowRight16",
        iconSize: 46,
        url: lh.link("reader", slug),
        title: data.attributes.title || "Start Reading",
        as: null
      };
    case "DOWNLOAD":
      return {
        url: data.attributes.attachmentStyles.original,
        title: data.attributes.title || "Download",
        icon: "arrowDown16",
        iconSize: 22.662,
        as: "a"
      };
    case "LINK":
      return {
        url: data.attributes.url,
        title: data.attributes.title || "Link",
        icon: null,
        iconSize: 46,
        as: "UserLink"
      };
    case "TOC":
      return {
        icon: "arrowRight16",
        iconSize: 46,
        title: data.attributes.title || "View Contents",
        url: tocSectionId
          ? lh.link("readerSection", slug, tocSectionId)
          : lh.link("reader", slug),
        as: "a"
      };
    case "ERROR":
      return {
        message: "Text Missing",
        as: "span"
      };
    default:
      return { mismatch: true };
  }
};

export const getLinkParams = (data, type) => {
  const slug = data.relationships?.texts?.attributes?.slug ?? null;
  const tocSectionId =
    data.relationships?.texts?.attributes.tocSectionId ?? null;

  switch (type) {
    case "READ":
      return {
        icon: "glasses64",
        iconSize: 17.333,
        url: lh.link("reader", slug),
        title: data.attributes.title || "Start Reading",
        as: null
      };
    case "DOWNLOAD":
      return {
        url: data.attributes.attachmentStyles.original,
        title: data.attributes.title || "Download",
        icon: "arrowDown16",
        iconSize: 17.333,
        as: "a"
      };
    case "LINK":
      return {
        url: data.attributes.url,
        title: data.attributes.title || "Link",
        icon: "arrowRight16",
        iconSize: 17.333,
        as: "UserLink"
      };
    case "TOC":
      return {
        icon: "toc64",
        iconSize: 17.333,
        title: data.attributes.title || "View Contents",
        href: tocSectionId
          ? lh.link("readerSection", slug, tocSectionId)
          : lh.link("reader", slug),
        as: null
      };
    case "ERROR":
      return {
        message: "Text Missing"
      };
    default:
      return { mismatch: true };
  }
};
