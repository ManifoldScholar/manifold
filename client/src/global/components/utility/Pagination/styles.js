import styled from "@emotion/styled";
import { listUnstyled, utilityPrimary, fluidScale } from "theme/styles/mixins";

export const Nav = styled.nav`
  ${utilityPrimary}
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  text-align: center;

  ul {
    ${listUnstyled}
  }

  li {
    line-height: 16px;
  }

  svg {
    width: 24px;
    height: 16px;
    transform: translateY(1px);
  }
`;

export const Columns = styled.ul`
  ${listUnstyled}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${fluidScale("60px", "50px")};
`;

export const Column = styled.li`
  flex: 0 0 auto;
`;

export const Pages = styled.ul`
  ${listUnstyled}
  display: flex;
  justify-content: center;
  gap: 14px;
`;

export const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &[aria-disabled="true"] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[aria-current="page"] {
    pointer-events: none;
    color: var(--color-interaction-light);
  }
`;
