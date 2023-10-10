import styled from "@emotion/styled";
import {
  fluidScale,
  buttonUnstyled,
  utilityPrimary,
  dragging,
  defaultFocusStyle
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
  padding-block: 13px;

  ${({ $dragging }) =>
    $dragging &&
    `
  ${dragging}

  background-color: var(--drawer-bg-color);
  padding-inline: 8px;
  border-radius: 5px;
  border: 0;
  `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
`;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const DragHandle = styled(Button)`
  cursor: grab;
`;
