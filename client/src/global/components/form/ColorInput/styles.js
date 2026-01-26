import styled from "@emotion/styled";
import { FormBaseInput } from "../BaseInput";

export const ColorInput = styled(FormBaseInput)`
  --ColorInput-default-color: ${({ $defaultColor }) => $defaultColor};

  input[type="color"] {
    width: 24px;
    height: 24px;
    display: inline-block;
    cursor: pointer;
    border: none;
  }

  span.ColorInput-wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
    font-family: var(--font-family-sans);
    padding-block-end: 8px;
    border-bottom: 1px solid var(--input-border-color);
  }
`;
