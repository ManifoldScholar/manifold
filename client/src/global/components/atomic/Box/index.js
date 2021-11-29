import React from "react";
import * as Styled from "./styles";

export default function Box({ children, className }) {
  return (
    <Styled.Container className={className}>
      <Styled.Background>{children}</Styled.Background>
    </Styled.Container>
  );
}

Box.displayName = "Global.Atomic.Box";
