import React from "react";
import Image from "./Image";
import {
  rteElements,
  renderedElements,
  markElements
} from "../../utils/elements";
import * as Styled from "./styles";

export default function SlateElement({ attributes, children, element }) {
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
      <a href={element.htmlAttrs.href} {...attributes}>
        {children}
      </a>
    );
  }
  if (
    rteElements.includes(element.type) ||
    renderedElements.includes(element.type) ||
    markElements.includes(element.type)
  ) {
    const Tag = element.type === "list-sibling" ? "span" : element.type;
    const className = element.htmlAttrs?.class || undefined;
    const epubType = element.htmlAttrs?.["data-epub-type"] || undefined;
    return (
      <Tag className={className} data-epub-type={epubType} {...attributes}>
        {children}
      </Tag>
    );
  }

  return (
    <div style={{ display: "inline-block" }} {...attributes}>
      {children}
      <Styled.Void contentEditable={false}>
        <span>{`<${element.type}/>`}</span>
      </Styled.Void>
    </div>
  );
}
