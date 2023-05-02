import React from "react";
import Image from "./Image";
import Void from "./Void";
import {
  rteElements,
  renderedElements,
  markElements
} from "../../utils/elements";

export default function SlateElement({
  attributes,
  children,
  element,
  theme,
  darkMode
}) {
  const className = element.htmlAttrs?.class || undefined;
  const epubType = element.htmlAttrs?.["data-epub-type"] || undefined;

  if (element.type === "br") {
    return <p {...attributes}>{children}</p>;
  }
  if (element.type === "hr") {
    return (
      <span contentEditable={false} {...attributes}>
        {children}
        <hr />
      </span>
    );
  }
  if (element.type === "void") {
    return (
      <Void
        attributes={attributes}
        element={element}
        theme={theme}
        darkMode={darkMode}
      >
        {children}
      </Void>
    );
  }
  if (element.type === "img") {
    return (
      <Image attributes={attributes} element={element}>
        {children}
      </Image>
    );
  }
  if (element.type === "iframe") {
    return (
      <Image as="iframe" attributes={attributes} element={element}>
        {children}
      </Image>
    );
  }
  if (element.type === "a") {
    return (
      <a
        className={className}
        data-epub-type={epubType}
        href={element.htmlAttrs.href}
        {...attributes}
      >
        {children}
      </a>
    );
  }
  if (element.type === "pre") {
    return (
      <pre className={className} data-epub-type={epubType} {...attributes}>
        <code>{children}</code>
      </pre>
    );
  }
  if (
    rteElements.includes(element.type) ||
    renderedElements.includes(element.type) ||
    markElements.includes(element.type)
  ) {
    const Tag = element.type === "list-sibling" ? "span" : element.type;
    return (
      <Tag className={className} data-epub-type={epubType} {...attributes}>
        {children}
      </Tag>
    );
  }

  return null;
}
