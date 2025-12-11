import styled from "@emotion/styled";
import BaseInput from "../BaseInput";

export const NumberInput = styled(BaseInput)`
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    text-align: left;
  }

  .drawer-backend {
    & input[type="number"] {
      color: var(--color-accent-primary);
    }
  }
`;
