import {
  rteElements,
  renderedElements,
  markElements,
  nestableElements,
  rteVoids
} from "../utils/elements";

export const isSlateVoid = element => {
  const isRteEl =
    (rteElements.includes(element) ||
      nestableElements.includes(element) ||
      element === "span") &&
    !rteVoids.includes(element);
  const isRendered = renderedElements.includes(element);
  const isMark = markElements.includes(element);
  return !(isRteEl || isRendered || isMark);
};

/* eslint-disable no-param-reassign */
const withVoids = editor => {
  const { isVoid } = editor;

  editor.isVoid = element => {
    return isSlateVoid(element.type) || isVoid(element);
  };

  return editor;
};

export default withVoids;
