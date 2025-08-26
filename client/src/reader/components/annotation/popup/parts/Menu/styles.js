import styled from "@emotion/styled";
import { outlineOnFocus } from "theme/styles/mixins";
import { Menu as ReakitMenu } from "reakit/Menu";

const transitionDuration = "0.3s";

export const Menu = styled(ReakitMenu)`
  /* overrides to reakit inline styles */
  position: absolute !important;
  top: 0 !important;
  left: 50% !important;
  display: block !important;
  /* end overrides to reakit inline styles */
  color: var(--menu-color);
  background-color: var(--menu-bg-color);
  border-radius: var(--box-border-radius);
  box-shadow: 0 12px 32px 3px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity ${transitionDuration} var(--transition-timing-function),
    transform ${transitionDuration} var(--transition-timing-function);
  transform: translateX(25%);
  min-width: 244px;

  .scheme-dark & {
    box-shadow: 0 12px 32px 3px rgba(85, 85, 85, 0.3);
  }

  &[data-direction="down"] {
    /* override reakit inline styles */
    top: 0 !important;
  }

  &[data-direction="up"] {
    /* override reakit inline styles */
    top: auto !important;
    bottom: 0;
  }

  &[data-active="true"] {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
    transition: opacity ${transitionDuration} var(--transition-timing-function),
      transform ${transitionDuration} var(--transition-timing-function);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${outlineOnFocus("var(--menu-bg-color)")}
    outline-offset: 2px;
  }
`;
