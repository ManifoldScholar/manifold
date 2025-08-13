import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins/typography";

export const Wrapper = styled.div`
  > * + * {
    margin-block-start: 24px;
  }
`;

export const List = styled.ul`
  > li + li {
    padding-block-start: 24px;
  }
`;

export const PaginationWrapper = styled.div`
  padding-block-start: 12px;
`;

export const Count = styled.div`
  ${utilityPrimary}
  font-size: 14px;
  margin-block-end: 16px;
  padding-block-end: 6px;
  border-bottom: 1px solid var(--color-base-neutral30);
  color: var(--color);
`;
