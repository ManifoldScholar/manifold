import { jsx } from "slate-hyperscript";
import { getChildren, textContent } from "domutils";
import { inlineNodes, markElements } from "../../utils/elements";
import { ElementType } from "htmlparser2";

const CONTEXT_VALUES = {
  block: "block",
  inline: "inline",
  listItem: "list",
  default: null
};

export const addSlateOnlySpan = node => {
  return jsx("element", { type: "span", slateOnly: true }, [node]);
};

const isInlineMath = node => {
  return node.type === "math" && node.htmlAttrs?.display === "inline";
};

const isInline = node => isInlineMath(node) || inlineNodes.includes(node.type);

const hasInvalidChildren = (children, context) => {
  const hasTextChild = children.find(c => c.text);
  const hasBlockChild = children.find(c => c.type && !isInline(c));
  const hasInlineChild = children.find(c => isInline(c));

  if (context === CONTEXT_VALUES.block || context === CONTEXT_VALUES.listItem) {
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
      if (!isInline(c)) return c;
      if (i === 0 || isInline(children[i - 1]))
        return [jsx("text", { text: "" }, []), c];
      return c;
    })
    .flat();
  const hasInlineLastChild = isInline(
    adjustedChildren[adjustedChildren.length - 1]
  );
  return hasInlineLastChild
    ? [...adjustedChildren, jsx("text", { text: "" }, [])]
    : adjustedChildren;
};

// Make an educated guess about whether text that preceeds or follows an image should wrap around it. Display inline-block is applied via a utility class, so this should be overridden by any styles in the stylesheet if this guess is wrong.
const isInlineImageAdjacent = (prev, next) => {
  if (prev?.type === "img" || next?.type === "img") return true;
  if (prev?.children?.length === 1 && prev?.children[0].type === "img")
    return true;
  if (next?.children?.length === 1 && next?.children[0].type === "img")
    return true;

  return false;
};

const isInlineImage = (prev, next) => {
  if (prev && (isInline(prev) || prev.text)) return true;
  if (next && (isInline(next) || next.text)) return true;

  return false;
};

const wrapBlockChildren = (children, isList) => {
  if (isList) {
    return children.map(c =>
      isInline(c) || c.text
        ? jsx("element", { type: "list-sibling", slateOnly: true }, c)
        : c
    );
  }
  return children.map((c, i) => {
    if (isInline(c) || c.text) {
      const inline = isInlineImageAdjacent(children[i - 1], children[i + 1]);
      return jsx("element", { type: "div", slateOnly: true, inline }, [c]);
    }
    if (c.type === "img") {
      if (isInlineImage(children[i - 1], children[i + 1]))
        return { ...c, htmlAttrs: { ...c.htmlAttrs, inline: true } };
    }
    return c;
  });
};

export const normalizeChildren = (children, context) => {
  if (!children || children.length === 0) return children;

  const isBlock = context === CONTEXT_VALUES.block;
  const isList = context === CONTEXT_VALUES.listItem;

  if (!hasInvalidChildren(children, context)) {
    if (isBlock || isList) {
      return [spaceInlineChildren(children), null];
    }
    return [children, null];
  }

  const normalizedChildren = spaceInlineChildren(
    wrapBlockChildren(children, isList)
  );

  if (isBlock || isList) return [normalizedChildren, null];
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

export const isOnlyFormat = str => {
  return /^[\n\t\r]+\s*$/.test(str);
};

export const replaceFormatChars = str => {
  return str.replace(/[\t\n\r]/g, "");
};

export const getNextNonFormat = el => {
  if (!el?.next) return {};
  if (el.next.tag) return el.next;
  if (!isOnlyFormat(el.next.data)) return el.next;
  return getNextNonFormat(el.next.next);
};

export const getPrevNonFormat = el => {
  if (!el?.prev) return {};
  if (el.prev.tag) return el.prev;
  if (!isOnlyFormat(el.prev.data)) return el.prev;
  return getNextNonFormat(el.prev.prev);
};

export const getSlateNodeContext = tag => {
  if (!tag) return CONTEXT_VALUES.default;
  if (tag === "li") return CONTEXT_VALUES.listItem;
  if (inlineNodes.includes(tag) || markElements.includes(tag))
    return CONTEXT_VALUES.inline;
  return CONTEXT_VALUES.block;
};

export const removeFormatOnlyChildren = el => {
  const filteredChildren = el.children.map(c => {
    if (c.type === ElementType.Text) {
      const rawText = c.data;
      if (isOnlyFormat(rawText)) return null;
    }
    if (c.children?.length) {
      return { ...c, children: removeFormatOnlyChildren(c).filter(Boolean) };
    }
    return c;
  });
  return filteredChildren.filter(Boolean);
};

export const isEmptyParagraph = el => {
  const hasAllTextChildren = el.children.every(
    c => c.type === "p" || c.type === "span" || c.text
  );
  return hasAllTextChildren && !textContent(el);
};
