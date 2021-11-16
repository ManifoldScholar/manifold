import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { fluidScale } from "theme/styles/mixins";

export const Header = styled.header`
  flex-grow: 999;
  display: flex;
  align-items: flex-start;
  gap: ${fluidScale("12px", "9px")};
`;

export const Icon = styled(IconComposer)`
  flex-shrink: 0;
  width: ${fluidScale("60px", "56px")};
  height: ${fluidScale("60px", "56px")};
  color: var(--weak-color);
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--strong-color);
  font-size: ${fluidScale("26px", "18px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-medium);

  ${Icon} + & {
    transform: translateY(${fluidScale("12px", "14px")});
  }
`;
