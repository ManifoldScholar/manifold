import humps from "humps";

export function createCustomPropertyName(namespace, tokenKey) {
  const prefix = namespace ? `${namespace}-` : "";
  return `--${prefix}${humps.decamelize(tokenKey, { separator: "-" })}`;
}

// takes an object of key/value pairs and returns a CSS variable for each entry
export function createCSSVariables(namespace, tokenObj) {
  return Object.keys(tokenObj)
    .map(
      key => `${createCustomPropertyName(namespace, key)}: ${tokenObj[key]};`
    )
    .join("");
}
