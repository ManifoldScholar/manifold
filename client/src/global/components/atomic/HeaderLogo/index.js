import React from "react";
// import * as Styled from "./styles";
import { Link } from "react-router-dom";

export default function HeaderLogo({ children, as = "a", href = "/", to }) {
  const Tag = as === "Link" ? Link : as;
  const linkProps = { href, to };
  return (
    <Tag className={""} {...linkProps}>
      {children}
    </Tag>
  );
}
