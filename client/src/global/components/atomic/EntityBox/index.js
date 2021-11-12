import React from "react";
import * as Styled from "./styles";

export default function EntityBox({ children, style }) {
  return (
    <Styled.Container style={style}>
      <Styled.Background>{children}</Styled.Background>
    </Styled.Container>
  );
}
