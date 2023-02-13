import { jsx } from "slate-hyperscript";
import { Parser, ElementType } from "htmlparser2";
import { DomHandler, isTag } from "domhandler";
import { getChildren, getName, textContent } from "domutils";
import has from "lodash/has";

import { config as defaultConfig } from "../../config/htmlToSlate/default";

import { extractCssFromStyle } from "../../utilities/domhandler";
import { getNested } from "../../utilities";
import { isBlock } from "../blocks";

import { getContext, isAllWhitespace, processTextValue } from "./whitespace";
import { handleChildMismatch } from "./utils";

const isSlateDeadEnd = element => {
  const keys = Object.keys(element);
  if (!("children" in element)) return false;
  return element.children.length === 0 && keys.length === 1;
};

const addTextNodeToEmptyChildren = element => {
  if (!("children" in element)) return element;
  if (element.children.length === 0) {
    element.children.push({ text: "" });
  }
  return element;
};

const gatherTextMarkAttributes = ({ el, config = defaultConfig }) => {
  let allAttrs = {};
  const children = getChildren(el);
  // tslint:disable-next-line no-unused-expression
  if (children.length > 0) {
    [el, ...children.flat()].forEach(child => {
      const name = getName(child);
      const attrs = config.textTags[el.parent.name]
        ? config.textTags[el.parent.name](child)
        : {};
      allAttrs = {
        ...allAttrs,
        ...attrs
      };
    });
    if (children.length === 1 && getChildren(children[0]).length > 0) {
      allAttrs = {
        ...allAttrs,
        ...gatherTextMarkAttributes({ el: children[0], config })
      };
    }
  } else {
    const name = getName(el);
    const attrs = config.textTags[el.parent.name]
      ? config.textTags[el.parent.name](el)
      : {};
    allAttrs = {
      ...attrs
    };
  }
  return allAttrs;
};

const deserialize = ({
  el,
  config = defaultConfig,
  index = 0,
  childrenLength = 0,
  context = ""
}) => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) {
    return null;
  }

  const parent = el;
  const isLastChild = index === childrenLength - 1;
  const nodeName = getName(parent);
  const childrenContext = getContext(nodeName) || context;

  if (nodeName === "br") {
    const isWithinTextNodes =
      parent.prev?.type === ElementType.Text &&
      parent.next?.type === ElementType.Text;
    return [jsx("text", { text: isWithinTextNodes ? "" : "\n" }, [])];
  }

  const children = parent.childNodes
    ? handleChildMismatch(
        parent.childNodes
          .map((node, i) =>
            deserialize({
              el: node,
              config,
              index: i,
              childrenLength: parent.childNodes.length,
              context: childrenContext
            })
          )
          .filter(element => element)
          .filter(element => !isSlateDeadEnd(element))
          .map(element => addTextNodeToEmptyChildren(element))
          .flat()
      )
    : [];

  if (getName(parent) === "body") {
    return jsx("fragment", {}, children);
  }

  if (el.type === ElementType.Tag) {
    const attrs = { type: nodeName, htmlAttrs: { ...el.attribs } };
    // elementAttributeMap is a convenient config for making changes to all elements
    // const style = getNested(config, "elementStyleMap");
    // if (style) {
    //   Object.keys(style).forEach(slateKey => {
    //     const cssProperty = style[slateKey];
    //     const cssValue = extractCssFromStyle(parent, cssProperty);
    //     if (cssValue) {
    //       attrs[slateKey] = cssValue;
    //     }
    //   });
    // }
    return jsx("element", attrs, children);
  }

  if (config.textTags[nodeName] || el.type === ElementType.Text) {
    const attrs = gatherTextMarkAttributes({ el: parent });
    const text = processTextValue({
      text: textContent(el),
      context: childrenContext,
      isInlineStart: index === 0,
      isInlineEnd: Number.isInteger(childrenLength) && isLastChild,
      isNextSiblingBlock:
        (el.next && isTag(el.next) && isBlock(el.next.tagName)) || false
    });
    if (
      (config.filterWhitespaceNodes &&
        isAllWhitespace(text) &&
        !childrenContext) ||
      text === ""
    ) {
      return null;
    }
    return !isAllWhitespace(text)
      ? [jsx("text", { ...attrs, text }, [])]
      : null;
  }

  return children;
};

export const htmlToSlate = (html, config = defaultConfig) => {
  let slateContent;
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // Handle error
    } else {
      // const updaters = config.htmlUpdaterMap
      //   ? Object.entries(config.htmlUpdaterMap)
      //   : [];
      // for (const [selector, updater] of updaters) {
      //   selectAll(selector, dom).forEach(element => {
      //     if (isTag(element)) {
      //       const updated = updater(element);
      //       if (updated !== null && updated !== element) {
      //         if (typeof updated === "string") {
      //           replaceElement(element, parseDocument(updated));
      //         } else {
      //           replaceElement(element, updated);
      //         }
      //       }
      //     }
      //   });
      // }
      slateContent = dom
        .map(node => deserialize({ el: node, config })) // run the deserializer
        .filter(element => element) // filter out null elements
        .map(element => {
          // ensure all top level elements have a children property
          if (!element.children) {
            return {
              children: element
            };
          }
          return element;
        })
        .filter(element => !isSlateDeadEnd(element))
        .map(element => addTextNodeToEmptyChildren(element));
    }
  });
  const parser = new Parser(handler, { decodeEntities: true });
  let updatedHtml = html;
  if (config.htmlPreProcessString instanceof Function) {
    updatedHtml = config.htmlPreProcessString(html);
  }
  parser.write(updatedHtml);
  parser.end();
  return slateContent;
};
