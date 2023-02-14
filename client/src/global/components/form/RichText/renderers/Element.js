import React from "react";
import HTMLBlock from "./HTMLBlock";

export default function SlateElement({ attributes, children, element }) {
  switch (element.type) {
    case "html":
      return (
        <HTMLBlock attributes={attributes} element={element}>
          {children}
        </HTMLBlock>
      );
    case "code-line":
      return (
        <div {...attributes} style={{ position: "relative" }}>
          {children}
        </div>
      );
    case "blockquote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "ul":
      return <ul {...attributes}>{children}</ul>;
    case "ol":
      return <ol {...attributes}>{children}</ol>;
    case "h1":
      return <h1 {...attributes}>{children}</h1>;
    case "h2":
      return <h2 {...attributes}>{children}</h2>;
    case "li":
      return <li {...attributes}>{children}</li>;
    case "p":
      // if (children.length === 1 && !children[0].props.text.text) return <br />;
      return <p {...attributes}>{children}</p>;
    case "section":
      return <section {...attributes}>{children}</section>;
    default:
      return <span {...attributes}>{children}</span>;
  }
}
