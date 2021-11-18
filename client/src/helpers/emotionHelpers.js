import isPropValid from "@emotion/is-prop-valid";

// styled-components-style transient prop support (`$someProp`)
export const transientOptions = {
  shouldForwardProp: propName =>
    isPropValid(propName) && !propName.startsWith("$")
};
