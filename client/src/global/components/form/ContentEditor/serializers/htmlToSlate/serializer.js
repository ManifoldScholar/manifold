import { jsx } from "slate-hyperscript";
import { Parser, ElementType } from "htmlparser2";
import { DomHandler, Document } from "domhandler";
import { getName, textContent } from "domutils";
import { blackList } from "../../utils/elements";
import { isSlateVoid } from "../../plugins/withVoids";
import htmlSerializer from "dom-serializer";
import has from "lodash/has";

import {
  normalizeChildren,
  addTextNodeToEmptyChildren,
  markTags,
  assignTextMarkAttributes,
  getSlateNodeContext,
  isOnlyFormat,
  replaceFormatChars,
  getNextNonFormat,
  getPrevNonFormat,
  removeFormatOnlyChildren,
  isEmptyParagraph
} from "./utils";

const deserializeVoid = (el, nodeName, children) => {
  if (nodeName === "hr" || nodeName === "br")
    return jsx("element", { type: nodeName });

  const adjustedEl = {
    ...el,
    children: removeFormatOnlyChildren(el)
  };

  const attrs = {
    type: "void",
    nodeName,
    htmlChildren: children,
    srcdoc: `<!DOCTYPE html><html><body class="manifold-text-section scheme-dark" style="height: 100%">${htmlSerializer(
      new Document(adjustedEl)
    )}</body></html>`,
    htmlAttrs: el.attribs ?? {}
  };
  return jsx("element", attrs, [{ text: "" }]);
};
const deserializeBody = children => {
  return jsx("fragment", {}, children);
};
const deserializeTag = (el, nodeName, children) => {
  const htmlAttrs = el.attribs ?? {};
  const attrs = { type: nodeName, htmlAttrs };
  const adjustedChildren =
    (nodeName === "p" || nodeName === "span") && isEmptyParagraph(el)
      ? [{ text: "" }]
      : children;
  return jsx("element", attrs, adjustedChildren);
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

const deserializeMarkTag = el => {
  const nodes = assignTextMarkAttributes(el);
  if (!Array.isArray(nodes[0])) {
    const [node, attrs] = nodes;
    return deserializeText(node, attrs);
  }
  return flatten(nodes)
    .map(([node, attrs]) => {
      return deserializeText(node, attrs);
    })
    .filter(Boolean);
};

const deserializeElement = el => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) return null;
  if (blackList.includes(el.type)) return null;

  const nodeName = getName(el);

  if (has(el.attribs, "void"))
    return deserializeVoid(el, nodeName, el.childNodes);

  if (nodeName === "br") {
    if (
      getNextNonFormat(el).type === "text" ||
      getPrevNonFormat(el).type === "text"
    )
      return jsx("text", { text: "\n" }, []);
    return jsx("element", { type: "p" }, [{ text: "" }]);
  }

  if (el.type === ElementType.Text) {
    return deserializeText(el);
  }

  if (Object.keys(markTags).includes(nodeName)) {
    return deserializeMarkTag(el);
  }

  if (
    isSlateVoid(nodeName, { children: el.children, htmlAttrs: el.attribs }) &&
    nodeName !== "img" &&
    nodeName !== "iframe"
  ) {
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

const deserializeDom = dom => {
  const nodes = dom
    .map(el => deserializeElement(el))
    .filter(Boolean)
    .map(element => addTextNodeToEmptyChildren(element));
  return nodes;
};

const deserializeChildren = children => {
  if (!children) return [];
  const nodes = deserializeDom(children).filter(Boolean);
  return nodes;
};

export const htmlToSlate = html => {
  let slateContent;
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // TODO:  Handle error
    } else {
      slateContent = deserializeDom(dom);
    }
  });

  const parser = new Parser(handler);
  parser.write(html);
  parser.end();

  if (slateContent.length === 1 && !slateContent[0].type) {
    return [
      {
        type: "section",
        children: slateContent[0].children,
        slateOnly: true
      }
    ];
  }
  if (slateContent.length >= 1) {
    return [
      {
        type: "section",
        children: slateContent,
        slateOnly: true
      }
    ];
  }
  if (!slateContent.length)
    return [
      {
        type: "section",
        children: [{ type: "p", children: [{ text: "" }] }],
        slateOnly: true
      }
    ];

  return slateContent;
};
