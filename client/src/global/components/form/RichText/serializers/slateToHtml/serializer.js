import { Document, Element, Text } from "domhandler";
import serializer from "dom-serializer";
import { Text as SlateText } from "slate";

import { isOnlyWhitespace, nestMarkElements, blankLineHandler } from "./utils";

const MARK_TAG_MAP = {
  strikethrough: "s",
  bold: "strong",
  underline: "u",
  italic: "em",
  code: "pre"
};

const serializeText = node => {
  const textContent = node.text;
  if (isOnlyWhitespace(textContent)) return null;

  const markElements = Object.keys(MARK_TAG_MAP)
    .map(key => {
      return node[key] ? MARK_TAG_MAP[key] : null;
    })
    .filter(Boolean);

  const textElement = nestMarkElements(markElements, new Text(textContent));

  return new Document(textElement);
};

/* eslint-disable no-use-before-define */
const serializeChildren = (children, config) => {
  if (!children) return [];
  return children.map(n => serializeNode(n, config)).filter(Boolean);
};

const serializeNode = node => {
  if (node.slateOnly) return serializeNode(node.children[0]);
  if (SlateText.isText(node)) return serializeText(node);

  const children = serializeChildren(node.children);
  const attrs = { ...node.htmlAttrs };

  if (!node.type) return new Element("div", attrs, children);
  if (node.type === "p") return blankLineHandler({ node, children });

  const el = new Element(node.type, attrs, children);
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
