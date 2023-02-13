import React from "react";
import Utility from "global/components/utility";
import { rteElements, renderedElements, markElements } from "../rteElements";

export default function SlateElement({ attributes, children, element }) {
  if (element.type === "br") {
    return <p {...attributes}>{[]}</p>;
  }
  if (element.type === "hr") {
    return (
      <span contentEditable={false} {...attributes}>
        {[]}
        <hr />
      </span>
    );
  }
  if (element.type === "img") {
    return (
      <div contentEditable={false} {...attributes}>
        <img
          height="200px"
          src={element.htmlAttrs.src}
          alt={element.htmlAttrs.alt}
        />
      </div>
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
    const Tag = element.type;
    const className = element.htmlAttrs?.class || undefined;
    const epubType = element.htmlAttrs?.["data-epub-type"] || undefined;
    return (
      <Tag className={className} data-epub-type={epubType} {...attributes}>
        {children}
      </Tag>
    );
  }

  return (
    <span
      style={{
        background: "gray",
        color: "black",
        paddingInline: "2px",
        marginInline: "2px",
        pointerEvents: "none"
      }}
      contentEditable={false}
      {...attributes}
    >
      {[]}
      <Utility.IconComposer icon="code16" />
    </span>
  );
}
