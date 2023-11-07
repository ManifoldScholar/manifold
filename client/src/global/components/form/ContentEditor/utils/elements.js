/* Element groups for rendering/editing in RTE */

// These elements can be inserted via the RTE UI. Fully editable.
export const rteElements = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ol",
  "ul",
  "li",
  "a",
  "list-sibling",
  "img",
  "iframe",
  "video"
];

// These elements are removable/insertable via the RTE but their contents cannot be edited as text.
export const rteVoids = ["img", "iframe", "video"];

// HTML container elements that nest in the RTE
export const nestableElements = [
  "header",
  "footer",
  "figure",
  "div",
  "section",
  "article",
  "figcaption",
  "blockquote",
  "pre"
];

// These elements are rendered in the RTE, but can't be created there. Their text children are editable, and these elements can be deleted in the RTE like any other block.
export const renderedElements = ["br", "hr", "abbr", "sub", "sup", "cite"];

// These elements are applied as marks to text leaves in Slate. They can be added and removed in the RTE. This probably needs some adjustment. For example, currently both del and s become "strikethrough" when serialized to Slate and there's no way to tell what the original tag was.
export const markElements = ["i", "del", "em", "s", "strong", "u", "code"];

// All other elements are Slate void elements and are rendered as preview only in the RTE.

/* Element groups for Slate normalizing */

// See https://docs.slatejs.org/concepts/02-nodes#blocks-vs.-inlines and https://docs.slatejs.org/concepts/11-normalizing#built-in-constraints
// This list mirrors the list of inline elements in the api serializer minus the elements that are marks rather than nodes in Slate.
export const inlineNodes = [
  "b",
  "big",
  "small",
  "tt",
  "abbr",
  "acronym",
  "cite",
  "dfn",
  "kbd",
  "samp",
  "time",
  "var",
  "a",
  "bdo",
  "map",
  "object",
  "q",
  "span",
  "sub",
  "sup",
  "button",
  "input",
  "label",
  "select",
  "textarea"
];

// Also duplicated from the api. These elements are removed during serialization and are never saved.
export const blackList = ["script", "link"];
