import React from "react";
import * as Styled from "./styles";

export default function EntityBox({ children, className }) {
  return (
    <Styled.Container className={className}>
      <Styled.Background>{children}</Styled.Background>
    </Styled.Container>
  );
}
