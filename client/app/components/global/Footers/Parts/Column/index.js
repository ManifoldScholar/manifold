import React from "react";
import * as Styled from "./styles";

export default function FooterColumn({
  position,
  footerType,
  className,
  children
}) {
  return (
    <Styled.Column
      $position={position}
      $footerType={footerType}
      className={className}
    >
      {children}
    </Styled.Column>
  );
}
