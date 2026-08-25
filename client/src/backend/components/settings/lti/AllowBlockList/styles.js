import styled from "@emotion/styled";
import {
  fluidScale,
  buttonUnstyled,
  utilityPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Item = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: ${fluidScale("18px", "16px")};
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.015em;
  border-bottom: 1px solid var(--input-border-color);
  padding-block: 0.6em;
  color: var(--input-color);
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 4px;
`;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}


  &:focus-visible {
    ${defaultFocusStyle}
  }

  &:hover {
    color: var(--error-color);
  }
`;

export const Wrapper = styled.div`
  --FieldGroup-child-flex-basis: calc(50% - var(--FieldGroup-column-gap));

  display: grid;
  grid-template-columns: 100%;
  gap: 0.5em;
  min-inline-size: 200px;

  & > div:has(input:focus-visible) > div {
    border-color: var(--focus-color);
    box-shadow: 0 1px 0 var(--focus-color);
  }
`;
