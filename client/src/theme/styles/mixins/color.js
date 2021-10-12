import get from "lodash/get";
import { baseColors } from "../variables/colors";

const Color = require("color");

/**
 * Drop-in replacements for Sass color functions plus a few extras
 */

// Look up color in variables, fallback to `color` param,
// and instantiate `Color`
function colorConstructor(color) {
  const baseColor = get(baseColors, color, color);
  return Color(baseColor);
}

export function rgba(color, alpha) {
  return colorConstructor(color)
    .alpha(alpha)
    .string();
}

export function transparentize(color, amount) {
  return colorConstructor(color).fade(amount);
}

export function uriEncodeHex(color) {
  return colorConstructor(color)
    .hex()
    .replace("#", "%23");
}

export function darken(color, amount) {
  return colorConstructor(color)
    .darken(amount)
    .hex();
}
