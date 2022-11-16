import styled from "@emotion/styled";
import { screenReaderText, utilityPrimary } from "theme/styles/mixins";

export const Wrapper = styled.label`
  display: flex !important;
  gap: 11px;
  align-items: flex-start;
  margin-block-start: 40px;
  margin-block-end: 10px;
`;

export const Checkbox = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background-color: none;
  border-radius: 3px;
  border: 1px solid var(--highlight-color);
  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    display: none;
    color: var(--highlight-color);
  }

  input:checked ~ & {
    > svg {
      display: block;
    }
  }
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
  color: var(--color-base-neutral-black);
  font-size: 14px;
  line-height: 22px;
  `}
`;

export const Input = styled.input`
  ${screenReaderText}
`;
