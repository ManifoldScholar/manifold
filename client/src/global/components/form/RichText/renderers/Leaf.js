import React from "react";

export default function SlateLeaf({ attributes, children, leaf }) {
  const { text, ...rest } = leaf;
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

  return (
    <span {...attributes} className={Object.keys(rest).join(" ")}>
      {leafChildren}
    </span>
  );
}
