import React from "react";

export default function HTMLBlock({ children, attributes }) {
  return (
    <div
      {...attributes}
      style={{
        fontFamily: "monospace",
        fontSize: "16px",
        lineHeight: "20px",
        marginTop: 0,
        padding: "5px 13px",
        position: "relative"
      }}
      spellCheck={false}
    >
      {children}
    </div>
  );
}
