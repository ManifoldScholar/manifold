import styled from "@emotion/styled";
import {
  listUnstyled,
  utilityPrimary,
  defaultTransitionProps
} from "theme/styles/mixins";

export const Wrapper = styled.div`
  .search-query + & {
    margin-block-start: 65px;
  }
`;

export const List = styled.ul`
  ${listUnstyled}
  margin: 14px 0 32px;
  border-top: 1px solid var(--color-base-neutral40);
  border-bottom: 1px solid var(--color-base-neutral40);
`;

export const NoResults = styled.span`
  ${utilityPrimary}
  font-size: 13px;
  color: var(--color);
  transition: color ${defaultTransitionProps};
`;
