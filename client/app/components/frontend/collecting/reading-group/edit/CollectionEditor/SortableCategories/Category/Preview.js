import * as React from "react";
import { createPortal } from "react-dom";
import * as Styled from "./styles";
import { MD_TITLE_REGEX } from "../../helpers/constants";

export default function Preview({ category, active, container }) {
  const { markdownOnly, title, descriptionPlaintext } =
    category?.attributes ?? {};

  const visibleTitle =
    markdownOnly && MD_TITLE_REGEX.test(title) ? descriptionPlaintext : title;

  return (
    active &&
    createPortal(
      <Styled.Wrapper>
        <Styled.Category $preview>
          <Styled.PreviewInner>
            <Styled.Title>{visibleTitle}</Styled.Title>
          </Styled.PreviewInner>
        </Styled.Category>
      </Styled.Wrapper>,
      container
    )
  );
}
