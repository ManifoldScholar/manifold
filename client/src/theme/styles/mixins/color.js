import get from "lodash/get";
import colorHelper from "tinycolor2";
import { baseColors } from "../variables/colors";

/**
 * Drop-in replacements for Sass color functions plus a few extras
 */

// Look up color in variables, fallback to `color` param,
// and instantiate `Color`
function colorConstructor(color) {
  const baseColor = get(baseColors, color, color);
  return colorHelper(baseColor);
}

export function rgba(color, alpha) {
  return colorConstructor(color)
    .setAlpha(alpha)
    .toRgbString();
}

export function transparentize(color, amount) {
  const newColor = colorConstructor(color);
  const alpha = newColor.getAlpha();
  const newAlpha = Math.max(0, alpha - amount);
  newColor.setAlpha(newAlpha);
  return newColor.toRgbString();
}

export function uriEncodeHex(color) {
  return colorConstructor(color)
    .toHexString()
    .replace("#", "%23");
}

export function darken(color, amount) {
  return colorConstructor(color)
    .darken(amount)
    .toHexString();
}

export function lighten(color, amount) {
  return colorConstructor(color)
    .lighten(amount)
    .toHexString();
}
