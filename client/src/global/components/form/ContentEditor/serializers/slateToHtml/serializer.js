import { Document, Element, Text } from "domhandler";
import serializer from "dom-serializer";
import { Text as SlateText } from "slate";
import isEmpty from "lodash/isEmpty";

import { isOnlyFormat, nestMarkElements, replaceLineBreaks } from "./utils";

const MARK_TAG_MAP = {
  strikethrough: "s",
  bold: "strong",
  underline: "u",
  italic: "em",
  code: "code"
};

const serializeText = node => {
  if (node.slateOnly) return null;

  const textContent = node.text;
  if (isOnlyFormat(textContent)) return null;

  const textSplits = replaceLineBreaks(textContent);

  const markElements = Object.keys(MARK_TAG_MAP)
    .map(key => {
      return node[key] ? MARK_TAG_MAP[key] : null;
    })
    .filter(Boolean);

  const textElements = [];
  textSplits.forEach((t, i) => {
    textElements.push(nestMarkElements(markElements, new Text(t)));
    if (i < textSplits.length - 1) textElements.push(new Element("br"));
  });

  return new Document(textElements);
};

const mergeSlateOnlyChildren = node => {
  if (!node.slateOnly) return node;
  return node.children;
};

/* eslint-disable no-use-before-define */
const serializeChildren = children => {
  if (!children) return [];

  return children
    .map(mergeSlateOnlyChildren)
    .flat()
    .map(serializeNode)
    .filter(Boolean);
};

const serializeNode = node => {
  if (!node) return null;

  if (SlateText.isText(node)) return serializeText(node);

  if (node.nodeName) {
    const { srcdoc, ...attrs } = node.htmlAttrs ?? {};
    return new Element(node.nodeName, attrs, node.htmlChildren);
  }

  const children = serializeChildren(node.children);
  const { inline, ...attrs } = node.htmlAttrs ?? {};

  if (node.type === "p" && children.length === 0 && isEmpty(attrs))
    return new Element("br");

  if (!node.type) return new Element("div", attrs, children);

  const el = node.slateOnly ? null : new Element(node.type, attrs, children);
  return el ?? new Document(children);
};

export const slateToDom = slate => {
  const document = slate.map(n => serializeNode(n)).filter(Boolean);
  return document;
};

export const slateToHtml = slate => {
  const document = slateToDom(slate);
  return serializer(document);
};
