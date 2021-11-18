import styled from "@emotion/styled";
import { entityFilterForm } from "theme/styles/variables/crossComponent";

export const Form = styled.form`
  flex-basis: ${entityFilterForm.searchMinWidth}px;

  input {
    border-width: 1px;
    border-radius: 8px;
    font-family: var(--font-family-sans);

    &:focus-visible {
      &::placeholder {
        color: var(--focus-color);
      }
    }
  }
`;
