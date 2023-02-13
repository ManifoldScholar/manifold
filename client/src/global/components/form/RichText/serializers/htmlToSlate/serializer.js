import { jsx } from "slate-hyperscript";
import { Parser, ElementType } from "htmlparser2";
import { DomHandler, isTag } from "domhandler";
import { getName, textContent } from "domutils";

import { isBlock } from "./blocks";
import {
  handleChildMismatch,
  replacePreTags,
  addTextNodeToEmptyChildren,
  textTags,
  assignTextMarkAttributes,
  getContext,
  isOnlyWhitespace,
  processTextValue
} from "./utils";

const deserializeVoid = nodeName => {
  return jsx("element", { type: nodeName });
};
const deserializeBody = children => {
  return jsx("fragment", {}, children);
};
const deserializeTag = (el, nodeName, children) => {
  const attrs = { type: nodeName, htmlAttrs: { ...el.attribs } };
  return jsx("element", attrs, children);
};
const deserializeText = (el, attrs, context, isFirstChild, isLastChild) => {
  const text = processTextValue({
    text: textContent(el),
    context,
    isInlineStart: isFirstChild,
    isInlineEnd: isLastChild,
    isNextSiblingBlock:
      (el.next && isTag(el.next) && isBlock(el.next.tagName)) || false
  });
  return !isOnlyWhitespace(text) ? jsx("text", { ...attrs, text }, []) : null;
};
const deserializeMarkTag = (el, context, isFirstChild, isLastChild) => {
  const nodes = assignTextMarkAttributes(el);
  if (!Array.isArray(nodes[0])) {
    const [node, attrs] = nodes;
    return deserializeText(node, attrs, context, isFirstChild, isLastChild);
  }
  return nodes
    .map(([node, attrs], i) => {
      const adjustedFirstChild = isFirstChild && i === 0;
      const adjustedLastChild = isLastChild && i === nodes.length - 1;
      return deserializeText(
        node,
        attrs,
        context,
        adjustedFirstChild,
        adjustedLastChild
      );
    })
    .flat();
};

const deserializeElement = ({
  el,
  index = 0,
  childrenLength = 0,
  context = ""
}) => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) {
    return null;
  }

  const nodeName = getName(el);
  const childrenContext = getContext(nodeName) || context;

  if (nodeName === "br" || nodeName === "hr") {
    return deserializeVoid(nodeName);
  }

  /* eslint-disable no-use-before-define */
  const children = deserializeChildren(el.childNodes, childrenContext);

  if (nodeName === "body") {
    return deserializeBody(children);
  }

  const isFirstChild = index === 0;
  const isLastChild = index === childrenLength - 1;

  if (Object.keys(textTags).includes(nodeName)) {
    return deserializeMarkTag(el, childrenContext, isFirstChild, isLastChild);
  }

  if (el.type === ElementType.Text) {
    return deserializeText(el, {}, childrenContext, isFirstChild, isLastChild);
  }

  if (el.type === ElementType.Tag) {
    return deserializeTag(el, nodeName, children);
  }
};

const deserializeDom = ({ dom, ...opts }) => {
  const nodes = dom
    .map((el, i) => deserializeElement({ el, index: i, ...opts }))
    .filter(Boolean)
    .map(element => addTextNodeToEmptyChildren(element));
  return nodes;
};

const deserializeChildren = (children, context) => {
  if (!children) return [];
  const nodes = deserializeDom({
    dom: children,
    childrenLength: children.length,
    context
  });
  return handleChildMismatch(nodes);
};

export const htmlToSlate = html => {
  let slateContent;
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // Handle error
    } else {
      slateContent = deserializeDom({ dom });
    }
  });

  const parser = new Parser(handler);
  const htmlToParse = replacePreTags(html);
  parser.write(htmlToParse);
  parser.end();
  return slateContent;
};
