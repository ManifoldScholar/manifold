import { jsx } from "slate-hyperscript";
import { Parser, ElementType } from "htmlparser2";
import { DomHandler, Document } from "domhandler";
import { getName, textContent } from "domutils";
import { blackList } from "../../utils/elements";
import { isSlateVoid } from "../../plugins/withVoids";
import htmlSerializer from "dom-serializer";

import {
  normalizeChildren,
  addTextNodeToEmptyChildren,
  markTags,
  assignTextMarkAttributes,
  getSlateNodeContext,
  isOnlyFormat,
  replaceFormatChars,
  getNextNonFormat,
  getPrevNonFormat
} from "./utils";

const deserializeVoid = (el, nodeName, children) => {
  if (nodeName === "hr" || nodeName === "br")
    return jsx("element", { type: nodeName });

  const attrs = {
    type: "iframe",
    nodeName,
    htmlChildren: children,
    htmlAttrs: {
      ...el.attribs,
      srcdoc: `<!DOCTYPE html><html><body class="manifold-text-section scheme-dark" style="height: 100%">${htmlSerializer(
        new Document(el)
      )}</body></html>`
    }
  };
  return jsx("element", attrs, [{ text: "" }]);
};
const deserializeBody = children => {
  return jsx("fragment", {}, children);
};
const deserializeTag = (el, nodeName, children) => {
  const attrs = { type: nodeName, htmlAttrs: { ...el.attribs } };
  return jsx("element", attrs, children);
};
const deserializeText = (el, attrs) => {
  const rawText = textContent(el);
  if (isOnlyFormat(rawText)) return null;
  const text = replaceFormatChars(rawText);
  return jsx("text", { ...attrs, text }, []);
};

const flatten = nodes => {
  let result = [];
  nodes.forEach(n => {
    if (n.length === 2) result.push(n);
    if (n.length > 2) result = [...result, ...flatten(n)];
  });
  return result;
};

const deserializeMarkTag = (el, context, isFirstChild, isLastChild) => {
  const nodes = assignTextMarkAttributes(el);
  if (!Array.isArray(nodes[0])) {
    const [node, attrs] = nodes;
    return deserializeText(node, attrs, context, isFirstChild, isLastChild);
  }
  return flatten(nodes)
    .map(([node, attrs], i) => {
      const adjustedFirstChild = isFirstChild && i === 0;
      const adjustedLastChild = isLastChild && i === test.length - 1;
      return deserializeText(
        node,
        attrs,
        context,
        adjustedFirstChild,
        adjustedLastChild
      );
    })
    .filter(Boolean);
};

const deserializeElement = ({
  el,
  index = 0,
  childrenLength = 0,
  context = ""
}) => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) return null;
  if (blackList.includes(el.type)) return null;

  const nodeName = getName(el);

  if (
    nodeName === "br" &&
    (getNextNonFormat(el).type === "text" ||
      getPrevNonFormat(el).type === "text")
  )
    return jsx("text", { text: "\n" }, []);

  const isFirstChild = index === 0;
  const isLastChild = index === childrenLength - 1;

  if (el.type === ElementType.Text) {
    return deserializeText(el);
  }

  if (Object.keys(markTags).includes(nodeName)) {
    return deserializeMarkTag(el, context, isFirstChild, isLastChild);
  }

  if (isSlateVoid(nodeName) && nodeName !== "img" && nodeName !== "iframe") {
    return deserializeVoid(el, nodeName, el.childNodes);
  }

  /* eslint-disable no-use-before-define */
  const children = deserializeChildren(
    el.childNodes,
    nodeName ? getSlateNodeContext(nodeName) : ""
  );

  const [normalizedChildren, normalizedTag] = normalizeChildren(
    children,
    nodeName ? getSlateNodeContext(nodeName) : ""
  );

  if (nodeName === "body") {
    return deserializeBody(normalizedChildren);
  }

  if (el.type === ElementType.Tag) {
    return deserializeTag(el, normalizedTag ?? nodeName, normalizedChildren);
  }
};

const deserializeDom = ({ dom, childrenLength, context }) => {
  const nodes = dom
    .map((el, i) =>
      deserializeElement({ el, index: i, childrenLength, context })
    )
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
  }).filter(Boolean);
  return nodes;
};

export const htmlToSlate = html => {
  let slateContent;
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // TODO:  Handle error
    } else {
      slateContent = deserializeDom({ dom });
    }
  });

  const parser = new Parser(handler);
  parser.write(html);
  parser.end();

  if (slateContent.length > 1) {
    return [
      {
        type: "section",
        children: slateContent
      }
    ];
  }
  if (slateContent.length === 1 && !slateContent[0].type) {
    return [
      {
        type: "section",
        children: slateContent[0].children
      }
    ];
  }
  if (!slateContent.length)
    return [
      {
        type: "section",
        children: [{ type: "p", children: [{ text: "" }] }]
      }
    ];

  return slateContent;
};
