import React from "react";
import * as Styled from "./styles";
import { Link } from "react-router-dom";

export default function HeaderLogo({ children, as = "a", href = "/", to }) {
  const linkProps = { href, to };
  return (
    <Styled.Link as={as === "Link" ? Link : as} {...linkProps}>
      {children}
    </Styled.Link>
  );
}
