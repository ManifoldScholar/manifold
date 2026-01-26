import has from "lodash/has";
import {
  isMathMLNode,
  findMathTagNode,
  findFirstMathUuidNode
} from "./mathHelpers";

const closest = (el, selector) => {
  let element = el;
  const matchesSelector =
    element.matches ||
    element.webkitMatchesSelector ||
    element.mozMatchesSelector ||
    element.msMatchesSelector;
  while (element) {
    if (matchesSelector.call(element, selector)) {
      break;
    }
    element = element.parentElement;
  }
  return element;
};

const findClosestTextNode = node => {
  if (isMathMLNode(node)) {
    const mathTagNode = findMathTagNode(node);
    return findFirstMathUuidNode(mathTagNode);
  }
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement;
    if (has(parent.dataset, "nodeUuid")) {
      return parent;
    }
    const ancestorNode = closest(parent, "[data-node-uuid]");
    return ancestorNode;
  }
  const ancestorNode = closest(node, "[data-node-uuid]");
  return ancestorNode;
};

const parentContainsSelection = (parent, nativeSelection) => {
  if (!nativeSelection) return true;
  if (!parent) return true;
  if (
    nativeSelection.anchorNode instanceof HTMLElement &&
    nativeSelection.focusNode instanceof HTMLElement
  ) {
    if (parent.contains(nativeSelection.anchorNode)) return true;
    if (parent.contains(nativeSelection.focusNode)) return true;
  } else if (
    nativeSelection.anchorNode instanceof Node &&
    nativeSelection.focusNode instanceof Node
  ) {
    if (parent.compareDocumentPosition(nativeSelection.anchorNode) & 16) {
      return true;
    }
    if (parent.compareDocumentPosition(nativeSelection.focusNode) & 16) {
      return true;
    }
  } else {
    return false;
  }
};

const selectionMatchesAnnotation = (selectionState, annotation) => {
  const compare = selectionState.selectionAnnotation;
  if (!annotation || !compare) return false;
  const {
    attributes: { endChar, endNode, startChar, startNode }
  } = annotation;
  const match =
    endChar === compare.endChar &&
    startChar === compare.startChar &&
    endNode === compare.endNode &&
    startNode === compare.startNode;
  return match;
};

const blockRegex = /^(address|fieldset|li|article|figcaption|main|aside|figure|nav|blockquote|footer|ol|details|form|p|dialog|h1|h2|h3|h4|h5|h6|pre|div|header|section|table|ul|hr|math)$/i;

const getClosestBlock = el => {
  if (blockRegex.test(el.nodeName)) return el;
  return getClosestBlock(el.parentElement);
};

const getBlockTextContent = el => {
  const clone = el.cloneNode(true);

  const fragment = new DocumentFragment();
  fragment.append(clone);

  const resources = fragment.querySelectorAll(
    "[data-annotation-resource-unselectable]"
  );
  resources.forEach(r => r.remove());

  return fragment.textContent;
};

const annotationAtBlockEnd = (endNode, endRangeText) => {
  const blockText = getBlockTextContent(getClosestBlock(endNode));

  return blockText.endsWith(endRangeText) || endRangeText.endsWith(blockText);
};

export default {
  closest,
  findClosestTextNode,
  parentContainsSelection,
  selectionMatchesAnnotation,
  blockRegex,
  annotationAtBlockEnd
};
