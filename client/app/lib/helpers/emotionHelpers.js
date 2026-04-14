import isPropValid from "@emotion/is-prop-valid";

// props that should always be forwarded
const ALLOWED_PROPS = [
  "url",
  "entity",
  "activeClassName",
  "isActive",
  "placeholderAttributes",
  "aria-expanded",
  "aria-controls",
  "aria-labelledby"
];

// styled-components-style transient prop support (`$someProp`)
export const transientOptions = {
  shouldForwardProp: propName => {
    if (ALLOWED_PROPS.indexOf(propName) >= 0) return true;

    return isPropValid(propName) && !propName.startsWith("$");
  }
};
