import styled from "styled-components";
import { listUnstyled } from "theme/styles/mixins";
import Message from "components/lti/Message";

export const EmptyMessage = styled(Message)`
  margin-block-start: 20px;
`;

export const ResultsCount = styled.p`
  font-family: var(--font-family-sans);
  font-size: 13px;
  color: var(--color-neutral-text-dark);
  margin: 0 0 16px;
`;

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  column-gap: 1rem;
  row-gap: 1.5rem;
  flex-wrap: wrap;
  width: 100%;
  margin-block-start: 32px;
  margin-block-end: 20px;
  color: var(--color-base-neutral90);
`;

export const List = styled.ul`
  ${listUnstyled}
  margin-block-start: 20px;
  margin-block-end: 40px;

  > li + li {
    margin-block-start: 16px;
  }
`;

export const PagerWrap = styled.div`
  margin-top: 32px;
`;
