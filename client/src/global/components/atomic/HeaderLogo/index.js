import React from "react";
import * as Styled from "./styles";
import { Link } from "react-router-dom";

export default function HeaderLogo({ children, as = "a", href = "/", to }) {
  const linkProps = { href, to };
  // For some reason that we haven't been able to discovery, Emotion triggers a react
  // hydration mismatch for the first styled component that's rendered, which, for now,
  // is this HeaderLogo component. The warning doesn't seem to be a problem, so we're
  // going to suppress it for now and keep an eye on it. Let's see if a future version
  // of Emotion resolves it for us and allows us to remove the suppressHydrationWarning
  // attribute.
  return (
    <Styled.Link
      suppressHydrationWarning
      as={as === "Link" ? Link : as}
      {...linkProps}
    >
      {children}
    </Styled.Link>
  );
}
