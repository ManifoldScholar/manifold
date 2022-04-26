import styled from "@emotion/styled";
import {
  buttonUnstyled,
  defaultHoverStyle,
  outlineOnFocus
} from "theme/styles/mixins";
import { entityFilterForm } from "theme/styles/variables/crossComponent";
import { borderStyles } from "../Filter/styles";

const { searchMinWidth } = entityFilterForm;

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  flex-basis: 0;
  flex-grow: 999;
  width: 100%;
  min-width: ${searchMinWidth}px;
`;

export const Button = styled.button`
  ${buttonUnstyled}
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  ${outlineOnFocus()}

  &:hover {
    ${defaultHoverStyle}
  }
`;

export const Input = styled.input`
  width: 100%;
  height: ${entityFilterForm.filterHeight};
  padding: 5px 40px 8px 44px;
  font-size: 17px;
  font-family: var(--font-family-sans);
  background-color: transparent;
  ${borderStyles}

  &::placeholder {
    color: var(--color);
  }

  &.focus-visible::placeholder {
    color: var(--focus-color);
  }
`;
