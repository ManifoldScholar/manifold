import { jsx } from "slate-hyperscript";
import { getChildren } from "domutils";
import { isBlock } from "./blocks";

export const addSlateOnlySpan = node => {
  return jsx("element", { type: "span", slateOnly: true }, [node]);
};

export const hasChildTypeMismatch = children => {
  const hasElementChild = children.find(c => c.type);
  const hasTextChild = children.find(c => c.text);
  return hasElementChild && hasTextChild;
};

export const handleChildMismatch = children => {
  if (!hasChildTypeMismatch(children)) return children;

  return children.map(c => (c.text ? addSlateOnlySpan(c) : c));
};

export const replacePreTags = html =>
  html.replace(/<pre[^>]*>/g, "<code>").replace(/<\/pre>/g, "</code>");

export const addTextNodeToEmptyChildren = element => {
  return element.children?.length === 0
    ? { ...element, children: [{ text: "" }] }
    : element;
};

export const textTags = {
  code: "code",
  pre: "code",
  del: "strikethrough",
  em: "italic",
  i: "italic",
  s: "strikethrough",
  strong: "bold",
  u: "underline"
};

export const getMarkAttributesForTag = tag => {
  if (Object.keys(textTags).includes(tag)) return { [textTags[tag]]: true };
};

export const assignTextMarkAttributes = (el, attrs) => {
  if (el.type === "text") return [el, attrs];

  const children = getChildren(el);
  const childCount = children.length;

  if (childCount === 1) {
    const [onlyChild] = children;
    if (onlyChild.type === "text") {
      return [onlyChild, { ...attrs, ...getMarkAttributesForTag(el.name) }];
    }
    return assignTextMarkAttributes(onlyChild, {
      ...attrs,
      ...getMarkAttributesForTag(el.name)
    });
  }

  return children.map(c =>
    assignTextMarkAttributes(c, {
      ...attrs,
      ...getMarkAttributesForTag(el.name)
    })
  );
};

const replaceNewlines = str => {
  return str.replace(/(?:\r\n|\r|\n)/g, " ");
};

const reduceToSingleSpaces = str => {
  return str.replace(/ +(?= )/g, "");
};

export const minifyText = str => {
  return reduceToSingleSpaces(replaceNewlines(str));
};

export const isOnlyWhitespace = str => {
  return !/[^\t\n\r ]/.test(str);
};

const preserveWhitespace = tagName => {
  return ["code", "pre", "xmp"].includes(tagName);
};

export const getContext = tagName => {
  if (!tagName || tagName.trim() === "") {
    return "";
  }
  if (preserveWhitespace(tagName)) {
    return "preserve";
  }
  if (isBlock(tagName)) {
    return "block";
  }
  return "inline";
};

export const processTextValue = ({
  text,
  context = "",
  isInlineStart = false,
  isInlineEnd = false,
  isNextSiblingBlock = false
}) => {
  if (context === "preserve") {
    return text;
  }
  if (context === "block") {
    // is this the start of inline content after a block element?
    if (isInlineStart) {
      return minifyText(text).trimStart();
    }
    // is this the end of inline content in a block element?
    if (isInlineEnd || isNextSiblingBlock) {
      return minifyText(text).trimEnd();
    }
  }
  return minifyText(text);
};
