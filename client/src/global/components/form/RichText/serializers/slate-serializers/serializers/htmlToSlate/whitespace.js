import { isBlock } from "../blocks";

const replaceNewlines = str => {
  return str.replace(/(?:\r\n|\r|\n)/g, " ");
};

const reduceToSingleSpaces = str => {
  return str.replace(/ +(?= )/g, "");
};

export const minifyText = str => {
  return reduceToSingleSpaces(replaceNewlines(str));
};

export const isAllWhitespace = str => {
  return !/[^\t\n\r ]/.test(str);
};

const preserveWhitespace = tagName => {
  return ["code", "pre", "xmp"].includes(tagName);
};

export const getContext = tagName => {
  if (!tagName || tagName.trim() === "") {
    return "";
  }
  if (preserveWhitespace(tagName)) {
    return "preserve";
  }
  if (isBlock(tagName)) {
    return "block";
  }
  return "inline";
};

export const processTextValue = ({
  text,
  context = "",
  isInlineStart = false,
  isInlineEnd = false,
  isNextSiblingBlock = false
}) => {
  let parsed = text;
  if (context === "preserve") {
    return parsed;
  }
  parsed = minifyText(parsed);
  if (context === "block") {
    // is this the start of inline content after a block element?
    if (isInlineStart) {
      parsed = parsed.trimStart();
    }
    // is this the end of inline content in a block element?
    if (isInlineEnd || isNextSiblingBlock) {
      parsed = parsed.trimEnd();
    }
  }
  return parsed;
};
