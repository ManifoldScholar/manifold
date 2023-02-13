import { jsx } from "slate-hyperscript";
import { getChildren } from "domutils";
import { inlineNodes } from "../../rteElements";

const CONTEXT_VALUES = {
  block: "block",
  inline: "inline",
  preserve: "preserve"
};

export const addSlateOnlySpan = node => {
  return jsx("element", { type: "span", slateOnly: true }, [node]);
};

// Implement this later...
// const isInlineMath = node => {
//   return node.type === "math" && node.htmlAttrs?.display === "inline";
// };

const hasInvalidChildren = (children, context) => {
  const hasTextChild = children.find(c => c.text);
  const hasBlockChild = children.find(
    c => c.type && !inlineNodes.includes(c.type)
  );
  const hasInlineChild = children.find(c => inlineNodes.includes(c.type));

  if (context === CONTEXT_VALUES.block) {
    if (!hasBlockChild) return false;
    if (hasTextChild || hasInlineChild) return true;
    return false;
  }

  if (context === CONTEXT_VALUES.inline) {
    if (hasBlockChild) return true;
  }

  return false;
};

const spaceInlineChildren = children => {
  const adjustedChildren = children
    .map((c, i) => {
      if (!inlineNodes.includes(c.type)) return c;
      if (i === 0 || inlineNodes.includes(children[i - 1]?.type))
        return [jsx("text", { text: "" }, []), c];
      return c;
    })
    .flat();
  const hasInlineLastChild = inlineNodes.includes(
    adjustedChildren[adjustedChildren.length - 1]?.type
  );
  return hasInlineLastChild
    ? [...adjustedChildren, jsx("text", { text: "" }, [])]
    : adjustedChildren;
};

const wrapBlockChildren = children => {
  return children.map(c => {
    if (inlineNodes.includes(c.type) || c.text)
      return jsx("element", { type: "div", slateOnly: true }, [c]);
    return c;
  });
};

export const normalizeChildren = (children, context) => {
  if (!children || children.length === 0) return children;
  if (!hasInvalidChildren(children, context)) {
    if (context === CONTEXT_VALUES.block) {
      return [spaceInlineChildren(children), null];
    }
    return [children, null];
  }

  const normalizedChildren = spaceInlineChildren(wrapBlockChildren(children));

  if (context === CONTEXT_VALUES.block) return [normalizedChildren, null];
  return [normalizedChildren, "div"];
};

export const replacePreTags = html =>
  html.replace(/<pre[^>]*>/g, "<code>").replace(/<\/pre>/g, "</code>");

export const addTextNodeToEmptyChildren = element => {
  return element.children?.length === 0
    ? { ...element, children: [{ text: "" }] }
    : element;
};

export const markTags = {
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
  if (Object.keys(markTags).includes(tag)) return { [markTags[tag]]: true };
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

const preserveWhitespace = tag => {
  return ["code", "pre", "xmp"].includes(tag);
};

export const getSlateNodeContext = tag => {
  if (!tag || tag.trim() === "") {
    return "";
  }
  if (preserveWhitespace(tag)) {
    return CONTEXT_VALUES.preserve;
  }
  if (inlineNodes.includes(tag)) {
    return CONTEXT_VALUES.inline;
  }
  return CONTEXT_VALUES.block;
};

export const processTextValue = ({
  text,
  context = "",
  isInlineStart = false,
  isInlineEnd = false,
  isNextSiblingBlock = false
}) => {
  if (context === CONTEXT_VALUES.preserve) {
    return text;
  }
  if (context === CONTEXT_VALUES.block) {
    if (isInlineStart) {
      return minifyText(text).trimStart();
    }
    if (isInlineEnd || isNextSiblingBlock) {
      return minifyText(text).trimEnd();
    }
  }
  return minifyText(text);
};
