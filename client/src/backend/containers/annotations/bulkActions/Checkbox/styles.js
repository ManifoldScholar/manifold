import styled from "@emotion/styled";
import { screenReaderText, defaultFocusStyle } from "theme/styles/mixins";

export const Wrapper = styled.label`
  display: flex !important;
  gap: 11px;
  align-items: flex-start;
`;

export const Checkbox = styled.div`
  --focus-color: var(--color-accent-primary);
  --highlight-color: var(--color-base-neutral45);

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

  input[data-checked="true"] ~ & {
    > svg {
      display: block;
    }
  }

  input:focus-visible ~ & {
    ${defaultFocusStyle}
  }
`;

export const Input = styled.input`
  ${screenReaderText}
`;
