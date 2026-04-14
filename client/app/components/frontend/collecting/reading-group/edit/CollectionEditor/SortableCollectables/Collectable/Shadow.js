import * as React from "react";
import * as Styled from "./styles";

export default function Shadow({ active }) {
  return (
    active && (
      <Styled.Wrapper>
        <Styled.Shadow />
      </Styled.Wrapper>
    )
  );
}
