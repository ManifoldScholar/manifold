import { createCSSVariables } from "../mixins/common";

export const fontFamily = {
  sans: "'sofia-pro', 'trueno', sans-serif",
  serif: "'freight-text-pro', 'aleo', serif"
};

export const fontWeight = {
  light: 200,
  book: 300,
  medium: 500,
  regular: 400,
  semibold: 600,
  bold: 700
};

export const fontSize = {
  100: "26px",
  70: "20px",
  60: "18px",
  50: "16px",
  40: "14px",
  30: "13px"
};

export const lineHeight = 1.2;

export default `
  ${createCSSVariables("font-family", fontFamily)}
  ${createCSSVariables("font-weight", fontWeight)}
  ${createCSSVariables("font-size", fontSize)}
  --line-height: ${lineHeight};
`;
