import React from "react";
import * as Styled from "./styles";

export default function HeaderLogo({ children, as = "a", href = "/", to }) {
  const Tag = as;
  const linkProps = { href, to };
  return (
    <Tag className={Styled.logoClass} {...linkProps}>
      {children}
    </Tag>
  );
}
