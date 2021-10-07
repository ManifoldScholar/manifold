import { createCSSVariables } from "../mixins";

const Color = require("color");

export const baseColors = {
  neutralWhite: "#ffffff",
  neutralBlack: "#000000",
  neutral05: "#f7f7f7",
  neutral10: "#ececec",
  neutral20: "#e6e6e6",
  neutral30: "#d6d6d6",
  neutral40: "#c3c3c3",
  neutral45: "#b3b3b3",
  neutral50: "#9a9a9a",
  neutral70: "#828282",
  neutral75: "#696969",
  neutral80: "#555555",
  neutral85: "#424242",
  neutral90: "#363636",
  neutral95: "#2e2e2e",
  neutral100: "#262626",
  neutral110: "#222222",
  blue20: "#d4edfa",
  blue45: "#61caff",
  blue75: "#19678f",
  green20: "#c7f2a7",
  green45: "#87c930",
  green75: "#3c6e1a",
  orange20: "#ffebce",
  orange45: "#fab048",
  orange75: "#875f27",
  pink20: "#ffd6e4",
  pink45: "#ff8ab1",
  pink75: "#99536a",
  red20: "#ffd1d1",
  red45: "#ff9191",
  red75: "#c42929",
  teal20: "#c0faf5",
  teal45: "#38d6c9",
  teal75: "#1d756e",
  violet20: "#f7dcf6",
  violet45: "#f58cee",
  violet75: "#9c4a96",
  yellow20: "#fff799",
  yellow45: "#f5e425",
  yellow75: "#706b2c"
};

// Default colors that meet WCAG AA color contrast guidelines
// Namespaced functionally by usage and context (light/dark modes)
// --------------------------------------------------------
export const neutralColors = {
  uiDullLight: baseColors.neutral70, // decorative or inactive elements against dark bgs
  textExtraLight: baseColors.neutral10, // for neutral75 bg
  uiExtraLight: baseColors.neutral40, // ""
  textLight: baseColors.neutral45, // for neutral80 ↑ bg
  uiLight: baseColors.neutral50, // ""
  uiDullDark: baseColors.neutral45, // decorative or inactive elements against dark bgs
  textDark: baseColors.neutral75, // for neutral10 ↓ bg
  uiDark: baseColors.neutral70, // ""
  textExtraDark: baseColors.neutral90, // for informational hierarchy with neutralTextDark
  uiExtraDark: baseColors.neutral85 // ""
};

const accentPrimaryBase = Color("#52e3ac");
const accentSecondaryBase = Color("#61caff"); // formerly analyticsHighlight
const accentTertiaryBase = Color("#2bd1fa"); // formerly spHighlight

// TODO: refine transformation values (these don't match expected output)
export const accentColors = {
  primary: accentPrimaryBase.hex(),
  primaryDark: accentPrimaryBase
    .desaturate(0.2097)
    .darken(0.1882)
    .hex(), // #34a178
  primaryMedium: accentPrimaryBase
    .desaturate(0.2094)
    .darken(0.1157)
    .hex(), // #3dbd8c
  primaryLight: accentPrimaryBase
    .saturate(0.0036)
    .lighten(0.0804)
    .hex(), // #75e9bd
  primaryDull: accentPrimaryBase
    .rotate(-3)
    .desaturate(0.1456)
    .lighten(0.2)
    .hex(), // #b1ead2
  primaryPale: accentPrimaryBase
    .desaturate(0.0155)
    .lighten(0.1941)
    .hex(), // #a8f0d5
  primaryExtraPale: accentPrimaryBase
    .saturate(0.0119)
    .lighten(0.2765)
    .hex(), // #cbf7e6
  primaryOffWhite: accentPrimaryBase
    .rotate(5)
    .desaturate(0.2214)
    .lighten(0.3549)
    .hex(), // #f0faf7
  secondary: accentSecondaryBase.hex(),
  secondaryPale: accentTertiaryBase
    .darken(0.1)
    .desaturate(0.19)
    .hex(),
  tertiary: accentTertiaryBase.hex(),
  tertiaryPale: accentTertiaryBase
    .rotate(-1)
    .desaturate(0.1444)
    .lighten(0.3431)
    .hex() // #d9f5fb
};

export const interactionColors = {
  light: accentPrimaryBase.hex(),
  dark: accentPrimaryBase
    .rotate(4)
    .saturate(0.1701)
    .darken(0.3529)
    .hex(), // #077A57
  focusSecondary: baseColors.neutral20,
  focusTertiary: baseColors.neutral30
};

export const notificationColors = {
  errorExtraLight: baseColors.red20,
  errorLight: baseColors.red45,
  errorDark: baseColors.red75,

  warningExtraLight: baseColors.yellow20,
  warningLight: baseColors.yellow45,
  warningDark: baseColors.yellow75,

  noticeExtraLight: baseColors.blue20,
  noticeLight: baseColors.blue45,
  noticeDark: baseColors.blue75
};

// default heading theming that's customizable in the backend
export const headerColors = {
  background: baseColors.neutralWhite,
  backgroundLight: baseColors.neutral05,
  foreground: neutralColors.textDark,
  foregroundActive: neutralColors.textExtraDark,
  foregroundHover: interactionColors.light
};

export const inputColors = {
  placeholder: neutralColors.uiLight,
  border: neutralColors.uiDullLight
};

// global defaults
export const defaultColors = {
  color: neutralColors.textDark,
  backgroundColor: baseColors.neutralWhite,
  hoverColor: interactionColors.light,
  focusColor: interactionColors.light,
  errorColor: notificationColors.errorDark,
  warningColor: notificationColors.warningDark,
  noticeColor: notificationColors.noticeDark
};

export const boxBorderRadius = "8px";

export default `
  ${createCSSVariables("color-base", baseColors)}
  ${createCSSVariables("color-neutral", neutralColors)}
  ${createCSSVariables("color-accent", accentColors)}
  ${createCSSVariables("color-interaction", interactionColors)}
  ${createCSSVariables("color-notification", notificationColors)}
  ${createCSSVariables("color-header", headerColors)}
  ${createCSSVariables("color-input", inputColors)}
  ${createCSSVariables(null, defaultColors)}
  --box-border-radius: ${boxBorderRadius};
`;
