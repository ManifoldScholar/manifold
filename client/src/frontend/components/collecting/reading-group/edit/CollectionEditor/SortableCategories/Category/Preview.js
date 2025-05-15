import * as React from "react";
import { createPortal } from "react-dom";
import * as Styled from "./styles";

export default function Preview({ category, active, container }) {
  const { markdownOnly, title, descriptionPlaintext } =
    category?.attributes ?? {};

  return (
    active &&
    createPortal(
      <Styled.Wrapper>
        <Styled.Category $preview>
          <Styled.PreviewInner>
            <Styled.Title>
              {markdownOnly ? descriptionPlaintext : title}
            </Styled.Title>
          </Styled.PreviewInner>
        </Styled.Category>
      </Styled.Wrapper>,
      container
    )
  );
}
