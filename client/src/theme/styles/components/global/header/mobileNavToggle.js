import {
  buttonUnstyled,
  defaultHoverStyle,
  respond
} from "theme/styles/mixins";

export default `
  .mobile-nav-toggle {
    ${buttonUnstyled}
    position: relative;

    ${respond(`display: none;`, 82)}

    &.focus-visible {
      ${defaultHoverStyle}
      outline: 0;
    }
  }
`;
