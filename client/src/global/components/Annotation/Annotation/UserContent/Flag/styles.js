import styled from "@emotion/styled";
import {
  respond,
  defaultFocusStyle,
  transparentize
} from "theme/styles/mixins";

export const Form = styled.form`
  --TextArea-border-color: var(--color);

  textarea {
    block-size: 150px !important;
    font-size: 18px;
  }

  > * + * {
    margin-block-start: 24px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-inline-start: auto;

  > button {
    flex-grow: 0;
    flex-basis: 50%;

    ${respond(`flex-basis: max-content`, 65)}
`;

export const Heading = styled.h2`
  color: ${$dark => ($dark ? `var(--strong-color)` : `var(--box-color)`)};
`;

export const Dialog = styled.dialog`
  position: fixed;
  top: 50%;
  transform: translate(0, -50%);
  max-height: 60dvh;
  width: min(90vw, 600px);
  border-radius: 20px;
  border: none;
  &:focus-visible {
    ${defaultFocusStyle}
  }
  &::backdrop {
    background-color: ${transparentize("neutralBlack", 0.3)};
  }
  .reader.scheme-dark & {
    background: var(--color-base-neutral90);
  }
`;
