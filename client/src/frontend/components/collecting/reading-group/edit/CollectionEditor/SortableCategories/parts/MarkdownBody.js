import React from "react";
import * as Styled from "./styles";

export default function MarkdownBody({ category }) {
  const descriptionFormatted = category?.attributes?.descriptionFormatted;

  return descriptionFormatted ? (
    <Styled.MarkdownBody
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: descriptionFormatted }}
    />
  ) : null;
}
