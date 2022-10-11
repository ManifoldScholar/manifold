import styled from "@emotion/styled";
import { IndicatorSwitchInner } from "./styles";

const BOOLEAN_HEIGHT = 26;
const BOOLEAN_WIDTH = BOOLEAN_HEIGHT * 2;

/* This styled component replaces the old boolean-primary utility class. */

export const Toggle = styled(IndicatorSwitchInner)`
  ${({ $checked }) =>
    $checked &&
    `background-color: var(--active-switch-bg-color);

    &::before {
      transform: translateX(${BOOLEAN_WIDTH - BOOLEAN_HEIGHT}px);
    }`}
`;
