import styled from "@emotion/styled";
import { listUnstyled, utilityPrimary, fluidScale } from "theme/styles/mixins";

const LINK_PADDING = 7;

export const Nav = styled.nav`
  ${utilityPrimary}
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  text-align: center;

  ul {
    ${listUnstyled}
    margin-block: -${LINK_PADDING}px;
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
  gap: ${fluidScale(`${60 - LINK_PADDING}px`, `${50 - LINK_PADDING}px`)};
`;

export const Column = styled.li`
  flex: 0 0 auto;
`;

export const Pages = styled.div`
  ${listUnstyled}
  display: flex;
  justify-content: center;
`;

export const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${LINK_PADDING}px;
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

export const Ellipsis = styled.div`
  padding: ${LINK_PADDING}px;
`;
