import * as React from "react";
import { createPortal } from "react-dom";
import * as Styled from "./styles";

export default function Preview({ category, active, container }) {
  return (
    active &&
    createPortal(
      <Styled.Wrapper>
        <Styled.Category $preview>
          <Styled.Inner>
            <Styled.Title>{category?.attributes.title}</Styled.Title>
          </Styled.Inner>
        </Styled.Category>
      </Styled.Wrapper>,
      container
    )
  );
}
