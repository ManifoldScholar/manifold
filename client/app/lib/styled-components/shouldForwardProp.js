import isPropValid from "@emotion/is-prop-valid";

export function shouldForwardProp(prop, target) {
  if (prop.startsWith("$")) return false;
  if (typeof target !== "string") return true;
  return isPropValid(prop);
}
