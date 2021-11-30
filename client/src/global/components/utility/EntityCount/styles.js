import styled from "@emotion/styled";
import { utilityPrimary, defaultTransitionProps } from "theme/styles/mixins";

export const Total = styled.p`
  ${utilityPrimary}
  font-size: 13px;
  color: var(--color);
  transition: color ${defaultTransitionProps};

  .section-heading-secondary & {
    float: right;
  }

  .section-heading-secondary a:hover & {
    color: var(--hover-color);
  }

  strong,
  b {
    font-weight: inherit;
    color: var(--strong-color);
  }
`;

export const Highlighted = styled.span`
  color: var(--strong-color);
`;
