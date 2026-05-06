import styled from "styled-components";

export const ResultsCount = styled.p`
  font-family: var(--font-family-sans);
  font-size: 13px;
  color: var(--color-neutral-text-dark);
  margin: 0 0 16px;
`;

export const Empty = styled.p`
  color: var(--color-neutral-text-dark);
  font-style: italic;
  padding: 16px 4px;
  margin: 0;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid var(--color-neutral-ui-dull-dark);
  border-radius: 4px;
  overflow: hidden;
`;

export const PagerWrap = styled.div`
  margin-top: 32px;
`;
