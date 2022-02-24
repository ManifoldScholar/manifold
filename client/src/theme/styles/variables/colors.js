import colorHelper from "tinycolor2";
import ColorSchemeGenerator from "helpers/colorSchemeGenerator";
import { createCustomPropertyName, createCSSVariables } from "./helpers";

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

const accentPrimaryBase = "#52e3ac";
const accentPrimaryColorScheme = new ColorSchemeGenerator(accentPrimaryBase);

const accentPrimaryCustomProperties = accentPrimaryColorScheme.generatedRules.join(
  "\n"
);

const accentSecondaryBase = "#61caff"; // formerly analyticsHighlight
const accentTertiaryBase = "#2bd1fa"; // formerly spHighlight

export const otherAccentColors = {
  secondary: colorHelper(accentSecondaryBase).toHexString(),
  secondaryPale: colorHelper(accentSecondaryBase)
    .darken(10)
    .desaturate(19)
    .toHexString(),
  tertiary: colorHelper(accentTertiaryBase).toHexString(),
  tertiaryPale: colorHelper(accentTertiaryBase)
    .spin(-1)
    .desaturate(14.44)
    .lighten(34.31)
    .toHexString() // #d9f5fb
};

export const interactionColors = {
  light: accentPrimaryBase,
  dark: colorHelper(accentPrimaryBase)
    .spin(4)
    .saturate(17.01)
    .darken(35.29)
    .toHexString(), // #077A57
  extraDark: colorHelper(accentPrimaryBase)
    .spin(5)
    .saturate(12.02)
    .darken(40.78)
    .toHexString(), // #085d43
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

const highlightPrimaryBase = "#2bd1fa";

export const annotationHighlightColors = {
  primaryBase: highlightPrimaryBase,
  primaryPale: colorHelper(highlightPrimaryBase)
    .spin(-1)
    .desaturate(14.44)
    .lighten(34.31)
    .toHexString(), // #d9f5fb
  primaryLight: colorHelper(highlightPrimaryBase)
    .desaturate(13.25)
    .lighten(20.59)
    .toHexString(), // #99e3f5
  primaryPaleLowContrast: colorHelper(highlightPrimaryBase)
    .spin(15)
    .desaturate(83.5)
    .darken(1.96)
    .toHexString(), // #808f9b
  secondaryBase: "#70c930",
  secondaryLight: "#c6eaac",
  secondaryPale: "#eaf7e0",
  secondaryPaleLowContrast: "#677b61",
  tertiaryBase: "#ff12ff",
  tertiaryLight: "#edaaed",
  tertiaryPale: "#f4dcf4",
  tertiaryPaleLowContrast: "#775e77",
  get mixed() {
    return colorHelper
      .mix(this.primaryPale, this.secondaryPale)
      .darken(20)
      .toHexString();
  }
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

export default `
  ${createCSSVariables("color-base", baseColors)}
  ${createCSSVariables("color-neutral", neutralColors)}
  ${accentPrimaryCustomProperties}
  ${createCSSVariables("color-accent", otherAccentColors)}
  ${createCSSVariables("color-interaction", interactionColors)}
  ${createCSSVariables("color-notification", notificationColors)}
  ${createCSSVariables("color-header", headerColors)}
  ${createCSSVariables("color-input", inputColors)}
  ${createCSSVariables(null, defaultColors)}
  ${createCSSVariables("color-annotation", annotationHighlightColors)}
`;
