import { isValidElement } from "react";
import has from "lodash/has";

const htmlRegex = /(<([^>]+)>)|(&#)|(&[a-z]*;)/gi;

export const maybeHtml = item => {
  const isHtml = typeof item === "object" && has(item, "__html");
  const hasTags = typeof item === "string" && !!item.match(htmlRegex)?.length;

  /* eslint-disable no-nested-ternary */
  return isHtml
    ? { dangerouslySetInnerHTML: { ...item } }
    : hasTags
    ? { dangerouslySetInnerHTML: { __html: item } }
    : {};
};

export const maybeReactNode = item => {
  const isReactNode =
    isValidElement(item) ||
    (typeof item === "string" && !item.match(htmlRegex)?.length);
  return isReactNode ? item : null;
};
