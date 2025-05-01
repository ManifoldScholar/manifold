import styled from "@emotion/styled";
import {
  fluidScale,
  buttonUnstyled,
  utilityPrimary,
  defaultFocusStyle,
} from "theme/styles/mixins";

export const Section = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: ${fluidScale("18px", "16px")};
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.015em;
  border-bottom: 1px solid var(--input-border-color);
  padding-block: 0.6em;
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
`;
