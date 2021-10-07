import { createCSSVariables } from "./helpers";

export const duration = {
  fast: "0.1s",
  default: "0.2s",
  slow: "0.4s"
};

export const timingFunction = "ease";

export default `
  ${createCSSVariables("transition-duration", duration)}
  --transition-timing-function: ${timingFunction};
`;
