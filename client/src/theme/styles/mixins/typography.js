import { css } from "styled-components";
import { baseColors } from "../variables/appearance";
import { respond, fluidScale } from "./common";

const Color = require("color");

// // Headings
// // --------------------------------------------------------
const headingBase = css`
  margin: 0;
  font-family: var(--font-family-heading);
`;

export const headingPrimaryFontSizing = css`
  font-size: ${fluidScale("26px", "22px")};
`;

export const headingPrimary = css`
  ${headingBase}
  ${headingPrimaryFontSizing}
  margin-bottom: 1.2em;
  font-weight: var(--font-weight-medium);
  hyphens: none;
  line-height: 1.32;
`;

export const headingSecondary = css`
  ${headingPrimary}
  font-size: ${fluidScale("22px", "20px")};
`;

export const headingTertiary = css`
  ${headingBase}
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
`;

export const headingQuaternary = css`
  ${headingBase}
  font-size: ${fluidScale("30px", "25px")};
`;

// // Utility (Browser UI, buttons, etc.)
// // --------------------------------------------------------
export const utilityPrimary = css`
  font-family: var(--font-family-sans);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.115em;
`;

export const resetWordWrap = css`
  hyphens: none;
  word-wrap: normal;
  overflow-wrap: normal;
`;

export const textTruncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// // Labels
// // --------------------------------------------------------
export const subtitlePrimary = css`
  font-family: var(--font-family-serif);
  font-style: italic;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.031em;
`;

export const formLabelPrimary = css`
  font-size: 12px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.125em;
`;

// // Forms
// // --------------------------------------------------------
export const formInputPrimary = css`
  font-size: ${fluidScale("20px", "17px")};
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.015em;
  border-radius: 0;
  appearance: none;
`;

export const formInputSecondary = css`
  ${formInputPrimary}
  width: 100%;
  // Explicit height so that elements can line up
  height: 32px;
  padding: 0;
  font-size: ${fluidScale("18px", "16px")};
  vertical-align: top;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid var(--input-border-color);
  outline: 0;
  transition: border-color var(--transition-duration-default)
    var(--transition-timing-function);

  ${respond(`height: 42px;`, 60)}

  &::placeholder {
    color: var(--input-placeholder-color);
  }

  &:-webkit-autofill {
    box-shadow: 0 0 0 1000px var(--background-color) inset;
    -webkit-text-fill-color: var(--input-autofill-color) !important;
  }
`;

export const formInputMessage = css`
  font-size: var(--font-size-50);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.05em;
`;

export const formInstructions = css`
  font-size: ${fluidScale("18px", "15px")};
  font-family: var(--font-family-copy);
  font-style: italic;
  text-transform: none;
`;

// // Overlay
// // --------------------------------------------------------
export const overlayCopy = css`
  font-size: var(--font-size-60);
  font-family: var(--font-family-copy);
  color: var(--color-base-neutral30);

  a {
    color: inherit;
  }
`;

// Underlines (RG member annotations styles)
// --------------------------------------------------------
// Uses an SVG background image to render custom underline style with color
// NOTE: color must be an encoded hex for this to work, so can't pass a CSS var

function underlineBgImage(style, color) {
  switch (style) {
    case "dots":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4.01344 1.79315' fill='${color}'%3E%3Cpath d='M.75844,1.64657a.75456.75456,0,0,1-.755-.75.746.746,0,0,1,.745-.75h.01a.75.75,0,0,1,0,1.5'/%3E%3C/svg%3E")`;
    case "dashes":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 1.79315' fill='${color}'%3E%3Crect y='0.39657' width='3' height='1'/%3E%3C/svg%3E")`;
    case "wavy":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8.28101 1.79315' fill='${color}'%3E%3Cpath d='M8.083,0A5.49633,5.49633,0,0,0,5.984.42719a4.48742,4.48742,0,0,1-1.888.366,4.48409,4.48409,0,0,1-1.891-.367A5.52606,5.52606,0,0,0,.10425,0H0V.99445a4.50067,4.50067,0,0,1,1.84491.36468,5.45027,5.45027,0,0,0,2.251.434,5.42948,5.42948,0,0,0,2.25-.435,4.48329,4.48329,0,0,1,1.888-.366c.01776,0,.02966.00219.04706.00232V0Z'/%3E%3C/svg%3E")`;
    default:
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8.28101 1.79315' fill='${color}'%3E%3Cpolygon points='0 1.397 8.28 1.397 8.28 0.397 0 0.397 0 1.397'/%3E%3C/svg%3E")`;
  }
}

export function styledUnderline(style = "solid", color = baseColors.neutral75) {
  const underlineColor = Color(color);
  const encodedColor = underlineColor.hex().replace("#", "%23");

  return css`
    background-repeat: repeat-x;
    background-position: 0% 99%;
    background-size: 8px 2.5px;
    background-image: ${underlineBgImage(style, encodedColor)};
  `;
}
