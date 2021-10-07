import humps from "humps";

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
