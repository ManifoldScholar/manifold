import React from "react";

export default function SlateLeaf({ attributes, children, leaf }) {
  let leafChildren = children;

  if (leaf.bold) {
    leafChildren = <strong>{leafChildren}</strong>;
  }

  if (leaf.italic) {
    leafChildren = <em>{leafChildren}</em>;
  }

  if (leaf.underline) {
    leafChildren = <u>{leafChildren}</u>;
  }

  if (leaf.strikethrough) {
    leafChildren = <s>{leafChildren}</s>;
  }

  if (leaf.code) {
    leafChildren = <code>{leafChildren}</code>;
  }

  return <span {...attributes}>{leafChildren}</span>;
}
