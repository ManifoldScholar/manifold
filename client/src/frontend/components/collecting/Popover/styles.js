import styled from "@emotion/styled";
import {
  formInputMessage,
  defaultTransitionProps,
  rgba,
  screenReaderText,
  utilityPrimary
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Popover = styled("div", transientOptions)`
  display: none;
  white-space: normal;
  line-height: var(--line-height);
  inline-size: 360px;
  max-inline-size: 90vw;
  padding: 20px;
  color: var(--color);
  background-color: var(--background-color);
  border-radius: var(--box-border-radius);
  border: none;
  box-shadow: 5px 15px 35px 8px ${rgba("neutralBlack", 0.13)};
  opacity: 0;
  transition: opacity ${defaultTransitionProps},
    display ${defaultTransitionProps}, overlay ${defaultTransitionProps};
  transition-behavior: allow-discrete;

  &:popover-open {
    display: block;
    opacity: 1;

    @starting-style {
      opacity: 0;
    }
  }

  @supports (position-area: block-end) {
    inset: auto;
    margin: 0;
    margin-block-start: 0.75rem;
    position-area: block-end span-inline-end;
    position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
  }
`;

export const Legend = styled.p`
  margin: 0;
  ${utilityPrimary}
  font-size: 13px;
  text-indent: 0;
`;

export const Group = styled.div`
  margin-block-start: 1.125rem;
`;

export const Status = styled("p", transientOptions)`
  ${({ $error }) =>
    $error
      ? `
    ${formInputMessage}
    margin-block-start: 10px;
    margin-block-end: 0;
    color: var(--error-color);
  `
      : screenReaderText}
`;
