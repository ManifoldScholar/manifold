import {
  rteElements,
  renderedElements,
  markElements,
  nestableElements,
  rteVoids
} from "../utils/elements";
import has from "lodash/has";

const isHtmlVideo = element => {
  const { htmlAttrs, children } = element ?? {};
  const src = htmlAttrs?.src;
  if (!src || !/api\/proxy\//.test(src)) return true;
  if (!children || !children.length > 1) return true;
  if (children.length === 1 && !has(children[0], "text")) return true;
  return false;
};

export const isSlateVoid = (type, element) => {
  const isRteEl =
    (rteElements.includes(type) ||
      nestableElements.includes(type) ||
      type === "span") &&
    !rteVoids.includes(type);
  const isRendered = renderedElements.includes(type);
  const isMark = markElements.includes(type);
  const isAssetVideo = type === "video" ? !isHtmlVideo(element) : false;

  return !(isRteEl || isRendered || isMark || isAssetVideo);
};

/* eslint-disable no-param-reassign */
const withVoids = editor => {
  const { isVoid } = editor;

  editor.isVoid = element => {
    return isSlateVoid(element.type, element) || isVoid(element);
  };

  return editor;
};

export default withVoids;
