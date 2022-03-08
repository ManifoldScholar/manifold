import styled from "@emotion/styled";
import { Link as ReactRouterLink } from "react-router-dom";
import {
  utilityPrimary,
  defaultTransitionProps,
  fluidScale
} from "theme/styles/mixins";

export const Link = styled(ReactRouterLink)`
  ${utilityPrimary}
  display: flex;
  align-items: center;
  gap: 0.625em;
  padding: ${fluidScale("8px", "5px")} 0.875em ${fluidScale("8px", "5px")}
    0.625em;
  text-decoration: none;
  font-size: 14px;
  background-color: var(--box-medium-bg-color);
  border: 1px solid var(--box-medium-bg-color);
  border-radius: 6px;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};

  &:hover {
    color: var(--strong-color);
    background-color: var(--color-interaction-light);
    border-color: var(--color-interaction-light);
  }
`;

export const Label = styled.span`
  flex-grow: 1;
`;
