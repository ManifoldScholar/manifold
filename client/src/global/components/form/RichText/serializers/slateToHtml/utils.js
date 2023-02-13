import { Element } from "domhandler";

export const isOnlyWhitespace = str => {
  return !/[^\t\n\r ]/.test(str);
};

export const blankLineHandler = ({ node, children }) => {
  if (node.children.length === 1 && node.children[0].text === "") {
    return new Element("br");
  }
  return new Element("p", {}, children);
};

const addMarkElement = (mark, node) => {
  return new Element(mark, {}, [node]);
};

export const nestMarkElements = (marks, node) => {
  return marks.reduce((domEl, mark) => addMarkElement(mark, domEl), node);
};
