import React from "react";
import { MathJaxContext as MJContext } from "better-react-mathjax";

export default function MathJaxContext({ children }) {
  return <MJContext version={3}>{children}</MJContext>;
}
