import humps from "humps";
import { respondBase } from "@castiron/style-mixins";

// takes an object of key/value pairs and returns a CSS variable for each entry
export function createCSSVariables(namespace, tokenObj) {
  const prefix = namespace ? `${namespace}-` : "";
  return Object.keys(tokenObj)
    .map(
      key =>
        `--${prefix}${humps.decamelize(key, { separator: "-" })}: ${
          tokenObj[key]
        };`
    )
    .join("");
}

export function respond(
  content,
  pxSize = getVariable("breakpoint", "wide"),
  operator = "min",
  aspect = "width"
) {
  return respondBase(content, pxSize, operator, aspect);
}
