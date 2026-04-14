import { respond, fluidScale } from "./common";
import { uriEncodeHex } from "./color";

// // Headings
// // --------------------------------------------------------
const headingBase = `
  margin: 0;
  font-family: var(--font-family-heading);
`;

export const headingPrimaryFontSizing = `
  font-size: ${fluidScale("26px", "22px")};
`;

export const headingPrimary = `
  ${headingBase}
  ${headingPrimaryFontSizing}
  margin-bottom: 1.2em;
  font-weight: var(--font-weight-medium);
  hyphens: none;
  line-height: 1.32;
`;

export const headingSecondary = `
  ${headingPrimary}
  font-size: ${fluidScale("22px", "20px")};
`;

export const headingTertiary = `
  ${headingBase}
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
`;

export const headingQuaternary = `
  ${headingBase}
  font-size: ${fluidScale("30px", "25px")};
`;

// // Utility (Browser UI, buttons, etc.)
// // --------------------------------------------------------
export const utilityPrimary = `
  font-family: var(--font-family-sans);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.115em;
`;

export const resetWordWrap = `
  hyphens: none;
  word-wrap: normal;
  overflow-wrap: normal;
`;

export const textTruncate = `
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-bottom: 1px;
`;

// // Labels
// // --------------------------------------------------------
export const subtitlePrimary = `
  font-family: var(--font-family-serif);
  font-style: italic;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.031em;
`;

export const formLabelPrimary = `
  font-size: 12px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.125em;
`;

// // Forms
// // --------------------------------------------------------
export const formInputBase = `
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.015em;
  border-radius: 0;
  appearance: none;
`;

export const formInputPrimary = `
  ${formInputBase}
  font-size: ${fluidScale("20px", "17px")};
`;

export const formInputSecondary = `
  ${formInputBase}
  width: 100%;
  /* Explicit height so that elements can line up */
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

export const formInputMessage = `
  font-size: var(--font-size-50);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.05em;
`;

export const formInstructions = `
  font-size: ${fluidScale("18px", "15px")};
  font-family: var(--font-family-copy);
  font-style: italic;
  text-transform: none;
`;

// // Overlay
// // --------------------------------------------------------
export const overlayCopy = `
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
  const encodedColor = uriEncodeHex(color);

  switch (style) {
    case "dots":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4.01344 1.79315' fill='${encodedColor}'%3E%3Cpath d='M.90256,1.79314A.902.902,0,0,1,0,.89657.89179.89179,0,0,1,.887,0l.0036,0h.012a.89657.89657,0,0,1,0,1.79314'/%3E%3C/svg%3E")`;
    case "dashes":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 1.79315' fill='${encodedColor}'%3E%3Crect y='0.18057' width='3' height='1.432'/%3E%3C/svg%3E")`;
    case "wavy":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 7.73456 1.79315' fill='${encodedColor}'%3E%3Cpath d='M7.64024,0A5.33009,5.33009,0,0,0,5.52143.44808,4.12154,4.12154,0,0,1,3.72928.84991,4.12161,4.12161,0,0,1,1.93712.44808,4.08623,4.08623,0,0,0,.09432,0H0V.94324a3.36163,3.36163,0,0,1,1.55983.44808,5.49756,5.49756,0,0,0,2.16945.40183A5.09,5.09,0,0,0,5.8044,1.39132,4.79709,4.79709,0,0,1,7.73456.94324h0V0Z' /%3E%3C/svg%3E%0A")`;
    default:
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8.28101 1.79315' fill='${encodedColor}'%3E%3Cpolygon points='0 1.613 8.28 1.613 8.28 0.181 0 0.181 0 1.613' /%3E%3C/svg%3E%0A")`;
  }
}

export function styledUnderline(style = "solid", color = "neutral75") {
  return `
    background-repeat: repeat-x;
    background-position: 0% 99%;
    background-size: ${style === "wavy" ? 10 : 8}px 3px;
    background-image: ${underlineBgImage(style, color)};
  `;
}
