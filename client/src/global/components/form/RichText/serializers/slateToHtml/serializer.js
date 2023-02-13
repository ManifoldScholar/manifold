import { Document, Element, Text } from "domhandler";
import serializer from "dom-serializer";
import { Text as SlateText } from "slate";
import isEmpty from "lodash/isEmpty";

import { isOnlyWhitespace, nestMarkElements } from "./utils";

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
  if (SlateText.isText(node)) return serializeText(node);

  const children = serializeChildren(node.children);
  const attrs = { ...node.htmlAttrs };

  if (children.length === 0 && isEmpty(attrs)) return null;

  if (!node.type) return new Element("div", attrs, children);

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
