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
  --min-width: var(--Search-min-width, ${searchMinWidth}px);

  position: relative;
  display: inline-block;
  flex-basis: 0;
  flex-grow: 999;
  width: 100%;
  min-width: var(--min-width);
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
  padding: 6px 40px 8px 44px;
  font-size: 16px;
  font-family: var(--font-family-sans);
  background-color: transparent;
  ${borderStyles}

  &::placeholder {
    color: var(--color);
  }

  &:focus-visible::placeholder {
    color: var(--focus-color);
  }
`;
