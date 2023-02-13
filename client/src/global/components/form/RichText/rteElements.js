// These elements can be inserted via the RTE UI. Fully editable.
export const rteElements = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "ol",
  "ul",
  "blockquote",
  "li"
];

// These elements are rendered in the RTE, but can't be created there. Their rteElement children are editable, and these elements can be removed in the RTE by removing all of their children.
export const renderedElements = [
  "header",
  "footer",
  "span",
  "figure",
  "div",
  "br",
  "span",
  "section",
  "figcaption",
  "hr",
  "a"
];

// add h3, h4, h5?, a, img, iframe?, text alignment?,
// render header, footer, figure, figcaption, br, hr

export const markElements = ["i", "del", "em", "s", "strong", "u"];
