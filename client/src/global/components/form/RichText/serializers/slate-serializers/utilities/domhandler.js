import { getAttributeValue } from "domutils";
import { Element, Text } from "domhandler";
import serializer from "dom-serializer";
import { parseStyleCssText } from ".";

/**
 * Generate nested mark elements
 *
 * nestedMarkElements should be recursive, but it works
 * so leaving it for now. Can handle a maximum of 5
 * elements. Really shouldn't be any more than that!
 */

export const nestedMarkElements = (els, element) => {
  let domEl = element;
  if (els.length === 0) {
    return domEl;
  }
  const el1 = els.pop();
  domEl = new Element(el1, {}, [domEl]);
  if (!els || els.length === 0) {
    return domEl;
  }
  const el2 = els.pop();
  domEl = new Element(el2, {}, [domEl]);
  if (!els || els.length === 0) {
    return domEl;
  }
  const el3 = els.pop();
  domEl = new Element(el3, {}, [domEl]);
  if (!els || els.length === 0) {
    return domEl;
  }
  const el4 = els.pop();
  domEl = new Element(el4, {}, [domEl]);
  if (!els || els.length === 0) {
    return domEl;
  }
  const el5 = els.pop();
  domEl = new Element(el5, {}, [domEl]);
  if (!els || els.length === 0) {
    return domEl;
  }
  return domEl;
};

export const nestedMarkElementsString = (els, text) => {
  return serializer(nestedMarkElements(els, new Text(text)));
};

/**
 * Extract css value from style attribute
 * @param el domhandler Element
 * @param attribute css attribute in camelCase
 * @returns css value or null
 */
export const extractCssFromStyle = (el, attribute) => {
  const cssText = el && getAttributeValue(el, "style");
  if (cssText) {
    const css = parseStyleCssText(cssText);
    if (css[attribute]) {
      return css[attribute];
    }
  }
  return null;
};
