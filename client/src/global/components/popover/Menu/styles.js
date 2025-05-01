import styled from "@emotion/styled";
import {
  buttonUnstyled,
  defaultTransitionProps,
  rgba,
} from "theme/styles/mixins";

export const Wrapper = styled.div`
  position: relative;
`;

export const Popover = styled.div`
  position: absolute;
  z-index: 1;
  inset-block-start: var(--PopoverMenu-inset-block-start, 100%);
  inset-inline-end: var(--PopoverMenu-inset-inline-end, 0);
  inline-size: max-content;
  min-inline-size: 6rem;
  max-inline-size: min(25rem, 90vw);
  display: flex;
  flex-direction: column;
  padding-block: 0.5em;
  color: var(--color);
  background-color: var(
    --PopoverMenu-background-color,
    var(--background-color)
  );
  border-radius: var(--box-border-radius);
  box-shadow: 5px 15px 35px 8px ${rgba("neutralBlack", 0.13)};
  transition:
    display ${defaultTransitionProps},
    opacity ${defaultTransitionProps},
    transform ${defaultTransitionProps};
  transition-behavior: allow-discrete;

  &[inert] {
    display: none;
    opacity: 0;
    // transform: translateY(-1rem);
  }
`;

export const Button = styled.button`
  ${buttonUnstyled}
  padding: 0.25em 20px 0.333em;
  text-align: end;
  font-size: 16px;
  font-family: var(--font-family-sans);
  font-weight: normal;
  letter-spacing: normal;

  &[aria-disabled="true"] {
    color: var(--disabled-control-color);
    pointer-events: none;
  }
`;
