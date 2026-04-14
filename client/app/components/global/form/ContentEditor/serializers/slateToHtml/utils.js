import { Element } from "domhandler";

export const isOnlyFormat = str => {
  return /^[\t\n\r]*$/.test(str);
};

const addMarkElement = (mark, node) => {
  return new Element(mark, {}, [node]);
};

export const nestMarkElements = (marks, node) => {
  return marks.reduce((domEl, mark) => addMarkElement(mark, domEl), node);
};

export const replaceLineBreaks = str => {
  return str.replace(/\t/g, "").split("\n");
};
