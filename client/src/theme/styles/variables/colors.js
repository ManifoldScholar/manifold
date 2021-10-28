import { createCustomPropertyName, createCSSVariables } from "./helpers";

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
  uiDullLight: `var(${createCustomPropertyName("color", "baseNeutral70")})`, // decorative or inactive elements against dark bgs
  textExtraLight: `var(${createCustomPropertyName("color", "baseNeutral10")})`, // for neutral75 bg
  uiExtraLight: `var(${createCustomPropertyName("color", "baseNeutral40")})`, // ""
  textLight: `var(${createCustomPropertyName("color", "baseNeutral45")})`, // for neutral80 ↑ bg
  uiLight: `var(${createCustomPropertyName("color", "baseNeutral50")})`, // ""
  uiDullDark: `var(${createCustomPropertyName("color", "baseNeutral45")})`, // decorative or inactive elements against dark bgs
  textDark: `var(${createCustomPropertyName("color", "baseNeutral75")})`, // for neutral10 ↓ bg
  uiDark: `var(${createCustomPropertyName("color", "baseNeutral70")})`, // ""
  textExtraDark: `var(${createCustomPropertyName("color", "baseNeutral90")})`, // for informational hierarchy with neutralTextDark
  uiExtraDark: `var(${createCustomPropertyName("color", "baseNeutral85")})` // ""
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
  focusSecondary: `var(${createCustomPropertyName("color", "baseNeutral20")})`,
  focusTertiary: `var(${createCustomPropertyName("color", "baseNeutral30")})`
};

export const notificationColors = {
  errorExtraLight: `var(${createCustomPropertyName("color", "baseRed20")})`,
  errorLight: `var(${createCustomPropertyName("color", "baseRed45")})`,
  errorDark: `var(${createCustomPropertyName("color", "baseRed75")})`,

  warningExtraLight: `var(${createCustomPropertyName(
    "color",
    "baseYellow20"
  )})`,
  warningLight: `var(${createCustomPropertyName("color", "baseYellow45")})`,
  warningDark: `var(${createCustomPropertyName("color", "baseYellow75")})`,

  noticeExtraLight: `var(${createCustomPropertyName("color", "baseBlue20")})`,
  noticeLight: `var(${createCustomPropertyName("color", "baseBlue45")})`,
  noticeDark: `var(${createCustomPropertyName("color", "baseBlue75")})`
};

// default heading theming that's customizable in the backend
export const headerColors = {
  background: `var(${createCustomPropertyName("color", "baseNeutralWhite")})`,
  backgroundLight: `var(${createCustomPropertyName("color", "baseNeutral05")})`,
  foreground: `var(${createCustomPropertyName("color", "neutralTextDark")})`,
  foregroundActive: `var(${createCustomPropertyName(
    "color",
    "neutralTextExtraDark"
  )})`,
  foregroundHover: `var(${createCustomPropertyName(
    "color",
    "interactionLight"
  )})`
};

export const inputColors = {
  placeholder: `var(${createCustomPropertyName("color", "neutralUiLight")})`,
  border: `var(${createCustomPropertyName("color", "neutralUiDullLight")})`
};

// global defaults
export const defaultColors = {
  color: `var(${createCustomPropertyName("color", "neutralTextDark")})`,
  backgroundColor: `var(${createCustomPropertyName(
    "color",
    "baseNeutralWhite"
  )})`,
  hoverColor: `var(${createCustomPropertyName("color", "interactionDark")})`,
  focusColor: `var(${createCustomPropertyName("color", "interactionDark")})`,
  errorColor: `var(${createCustomPropertyName(
    "color",
    "notificationErrorDark"
  )})`,
  warningColor: `var(${createCustomPropertyName(
    "color",
    "notificationWarningDark"
  )})`,
  noticeColor: `var(${createCustomPropertyName(
    "color",
    "notificationNoticeDark"
  )})`
};

const highlightPrimaryBase = Color("#2bd1fa");

const annotationHighlightColors = {
  primaryBase: highlightPrimaryBase.hex(),
  primaryPale: highlightPrimaryBase
    .rotate(-1)
    .desaturate(0.1444)
    .lighten(0.3431)
    .hex(), // #d9f5fb
  primaryLight: highlightPrimaryBase
    .desaturate(0.1325)
    .lighten(0.2059)
    .hex(), // #99e3f5
  primaryPaleLowContrast: Color(highlightPrimaryBase.hue() + 15)
    .desaturate(0.835)
    .darken(0.0196)
    .hex(), // #808f9b
  secondaryBase: "#70c930",
  secondaryLight: "#c6eaac",
  secondaryPale: "#eaf7e0",
  secondaryPaleLowContrast: "#677b61",
  tertiaryBase: "#ff12ff",
  tertiaryLight: "#edaaed",
  tertiaryPale: "#f4dcf4",
  tertiaryPaleLowContrast: "#775e77",
  get mixed() {
    return Color(this.primaryPale)
      .mix(Color(this.secondaryPale))
      .darken(0.2)
      .hex();
  }
};

export default `
  ${createCSSVariables("color-base", baseColors)}
  ${createCSSVariables("color-neutral", neutralColors)}
  ${createCSSVariables("color-accent", accentColors)}
  ${createCSSVariables("color-interaction", interactionColors)}
  ${createCSSVariables("color-notification", notificationColors)}
  ${createCSSVariables("color-header", headerColors)}
  ${createCSSVariables("color-input", inputColors)}
  ${createCSSVariables(null, defaultColors)}
  ${createCSSVariables("color-annotation", annotationHighlightColors)}
`;
