import has from "lodash/has";

export const mathMLElements = [
  "math",
  "maction",
  "annotation",
  "annotation-xml",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mi",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mprescripts",
  "mroot",
  "mrow",
  "ms",
  "semantics",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "ci",
  "cn",
  "cs",
  "csymbol",
  "apply",
  "bind",
  "bvar",
  "share",
  "cerror",
  "cbytes"
];

export const isMathMLNode = node => {
  return node?.nodeName ? mathMLElements.includes(node.nodeName) : false;
};

export const isMathMLWrapper = node => {
  return node ? node.dataset?.mathml : false;
};

export const isMathTagNode = node => {
  return node ? node.nodeName === "math" : false;
};

export const findMathTagNode = node => {
  if (isMathMLWrapper(node)) return node.firstChild;
  if (isMathTagNode(node)) return node;

  const parent = node.parentNode;
  if (isMathTagNode(parent)) return parent;

  return findMathTagNode(parent);
};

const hasUuid = node => {
  return has(node.dataset, "nodeUuid");
};

const findFirstUuid = node => {
  if (hasUuid(node)) {
    return node;
  }
  return findFirstUuid(node.childNodes[0]);
};

const findLastUuid = node => {
  if (hasUuid(node)) {
    return node;
  }
  return findLastUuid([...node.childNodes].pop());
};

export const findFirstMathUuidNode = node => {
  const mathTagNode = findMathTagNode(node);
  return findFirstUuid(mathTagNode.childNodes[0]);
};
export const findLastMathUuidNode = node => {
  const mathTagNode = findMathTagNode(node);
  return findLastUuid([...mathTagNode.childNodes].pop());
};
