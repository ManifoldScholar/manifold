import React from "react";

export default function SlateElement({ attributes, children, element }) {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "ul-list":
      return <ul {...attributes}>{children}</ul>;
    case "ol-list":
      return <ol {...attributes}>{children}</ol>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}
