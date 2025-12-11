import styled from "@emotion/styled";
import {
  screenReaderText,
  utilityPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Wrapper = styled.label`
  display: flex !important;
  gap: 11px;
  align-items: flex-start;
`;

export const Checkbox = styled.div`
  --focus-color: var(--color-accent-primary);

  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background-color: none;
  border-radius: 3px;
  border: 1px solid var(--highlight-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  > svg {
    display: none;
    color: var(--highlight-color);
  }

  input:checked ~ & {
    > svg {
      display: block;
    }
  }

  input:focus-visible ~ & {
    ${defaultFocusStyle}
  }
`;

export const CheckboxWhite = styled(Checkbox)`
  --highlight-color: var(--color-base-neutral110);

  background-color: var(--color-base-neutral-white);
`;

export const Label = styled.span`
  font-family: var(--font-family-copy);
  font-size: 18px;
  text-transform: none;
  color: var(--color-neutral-text-light);

  .bg-neutral05 & {
    color: var(--color-neutral-text-extra-dark);
  }

  ${({ $labelStyle }) =>
    $labelStyle === "heading" &&
    `
  ${utilityPrimary}
  color: var(--color-accent-primary);
  font-size: 14px;
  line-height: 22px;
  `}
`;

export const Input = styled.input`
  ${screenReaderText}
`;
