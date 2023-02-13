import { Element } from "domhandler";

export const isOnlyWhitespace = str => {
  return !/[^\t\n\r ]/.test(str);
};

const addMarkElement = (mark, node) => {
  return new Element(mark, {}, [node]);
};

export const nestMarkElements = (marks, node) => {
  return marks.reduce((domEl, mark) => addMarkElement(mark, domEl), node);
};
